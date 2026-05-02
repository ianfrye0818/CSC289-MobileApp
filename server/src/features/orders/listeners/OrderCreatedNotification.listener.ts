import { ExpoPushService } from '@/features/notifications/services/ExpoPushService';
import { EmitWebhookEventCommand } from '@/features/webhooks/commands/EmitWebhookEvent/EmitWebhookEventCommand';
import { OrderCreatedEvent } from '@/features/webhooks/events/OrderCreatedEvent';
import { WebhookEvents } from '@/features/webhooks/types/WebhookEvents.type';
import { AppLogger } from '@/services/AppLogger.service';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OrderCreatedNotificationListener {
  private readonly logger = new AppLogger(
    OrderCreatedNotificationListener.name,
  );
  constructor(
    private readonly expoPushService: ExpoPushService,
    public readonly commandBus: CommandBus,
  ) {}

  @OnEvent(WebhookEvents.ORDER_CREATED)
  async handleOrderCreatedEvent(payload: OrderCreatedEvent) {
    const { orderId, customerId } = payload;
    this.logger.log(`ORDER_CREATED event received — orderId=${orderId} customerId=${customerId}`);

    this.commandBus
      .execute(
        new EmitWebhookEventCommand({
          event: WebhookEvents.ORDER_CREATED,
          payload: { orderId, customerId },
        }),
      )
      .catch((err) => this.logger.error('Error emitting webhook event', err));

    this.expoPushService
      .sendToCustomer(
        customerId,
        'Order created',
        `Congratulations! Your order #${orderId} has been received. We will notify you when it is ready to be shipped.`,
      )
      .catch((err) =>
        this.logger.error('Error sending order created notification', err),
      );
  }
}
