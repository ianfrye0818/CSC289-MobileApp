import { RedisService } from '@/services/Redis.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterWebhookCommand } from './RegisterWebhookCommand';

/** Hash value placeholder; field name is the subscriber URL. */
const WEBHOOK_SUBSCRIBER_MARK = '1';

@CommandHandler(RegisterWebhookCommand)
export class RegisterWebhookCommandHandler implements ICommandHandler<RegisterWebhookCommand> {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Registers a webhook for the given events.
   * @param command - The command containing the webhook registration data
   * @returns void
   */
  async execute(command: RegisterWebhookCommand): Promise<void> {
    const { dto } = command;

    for (const event of dto.events) {
      const key = `webhooks:${event}`;
      await this.redisService.hset(key, dto.url, WEBHOOK_SUBSCRIBER_MARK);
    }
  }
}
