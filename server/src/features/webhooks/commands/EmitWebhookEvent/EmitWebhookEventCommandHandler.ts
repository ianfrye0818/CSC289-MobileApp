import { AppLogger } from '@/services/AppLogger.service';
import { RedisService } from '@/services/Redis.service';
import { sleep } from '@/utils/sleep';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmitEventRequestDto } from '../../dtos/EmitEventRequestDto';
import { EmitWebhookEventCommand } from './EmitWebhookEventCommand';

/** Timeout for webhook delivery attempts. */
const WEBHOOK_FETCH_TIMEOUT_MS = 15_000;

@CommandHandler(EmitWebhookEventCommand)
export class EmitWebhookEventCommandHandler implements ICommandHandler<EmitWebhookEventCommand> {
  private readonly MAX_RETRY_COUNT = 3;
  private readonly logger = new AppLogger(EmitWebhookEventCommandHandler.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: EmitWebhookEventCommand): Promise<void> {
    const { dto } = command;
    this.eventEmitter.emit(dto.event, dto.payload);
    void this.dispatchWebhooks(dto).catch((err) => {
      this.logger.error(
        `Webhook dispatch failed for event ${dto.event}: ${err}`,
      );
    });
  }

  /**
   * Dispatches webhooks to all registered subscribers for the given event.
   * Retries delivery up to MAX_RETRY_COUNT times with exponential backoff.
   * @param dto - Webhook event data
   */
  private async dispatchWebhooks(dto: EmitEventRequestDto): Promise<void> {
    const hash = await this.redisService.hgetall<Record<string, unknown>>(
      `webhooks:${dto.event}`,
    );
    const subscribers = hash ? Object.keys(hash) : [];
    if (!subscribers.length) {
      this.logger.warn(`No subscribers found for event ${dto.event}`);
      return;
    }

    const outcomes = await Promise.all(
      subscribers.map((subscriber) => this.deliverWithRetries(subscriber, dto)),
    );

    const failed = outcomes.filter((ok) => !ok).length;
    if (failed > 0) {
      this.logger.warn(
        `Webhook dispatch for ${dto.event}: ${failed}/${subscribers.length} subscribers failed after retries`,
      );
    }
  }

  /**
   * Delivers a webhook to a single subscriber with retries.
   * @param subscriber - The URL of the subscriber
   * @param dto - Webhook event data
   * @returns True if the webhook was delivered successfully, false otherwise
   */
  private async deliverWithRetries(
    subscriber: string,
    dto: EmitEventRequestDto,
  ): Promise<boolean> {
    try {
      new URL(subscriber);
    } catch {
      this.logger.warn(`Invalid webhook URL, skipping: ${subscriber}`);
      return false;
    }

    let lastError: unknown;

    for (let attempt = 1; attempt <= this.MAX_RETRY_COUNT; attempt++) {
      const result = await this.postWebhookOnce(subscriber, dto);
      if (result.ok) {
        return true;
      }
      lastError = result.error;

      if (attempt < this.MAX_RETRY_COUNT) {
        await sleep(this.exponentialBackoffMs(attempt));
      }
    }

    this.logger.error(
      `Webhook delivery failed after ${this.MAX_RETRY_COUNT} attempts for ${subscriber}: ${lastError}`,
    );
    return false;
  }

  /**
   * Posts a webhook to a single subscriber.
   * @param subscriber - The URL of the subscriber
   * @param dto - Webhook event data
   * @returns True if the webhook was delivered successfully, false otherwise
   */
  private async postWebhookOnce(
    subscriber: string,
    dto: EmitEventRequestDto,
  ): Promise<{ ok: true } | { ok: false; error: unknown }> {
    try {
      const response = await fetch(subscriber, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
        signal: AbortSignal.timeout(WEBHOOK_FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        return {
          ok: false,
          error: new Error(`HTTP ${response.status} ${response.statusText}`),
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error };
    }
  }

  /**
   * Calculates the exponential backoff time in milliseconds.
   * @param attempt - The number of attempts
   * @returns The backoff time in milliseconds
   */
  private exponentialBackoffMs(attempt: number): number {
    const base = 300;
    const cap = 10_000;
    return Math.min(base * 2 ** (attempt - 1), cap);
  }
}
