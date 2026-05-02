import { ExpoPushService } from '@/features/notifications/services/ExpoPushService';
import { ShippingStatusUpdatedEvent } from '@/features/webhooks/events/ShippingStatusUpdatedEvent';
import { WebhookEvents } from '@/features/webhooks/types/WebhookEvents.type';
import { AppLogger } from '@/services/AppLogger.service';
import { PrismaService } from '@/services/Prisma.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ShippingStatus } from '../dtos/ShippingStatus.enum';

@Injectable()
export class OrderStatusChangedNotificationListener {
  private readonly logger = new AppLogger(
    OrderStatusChangedNotificationListener.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: ExpoPushService,
  ) {}

  @OnEvent(WebhookEvents.SHIPPING_STATUS_UPDATED)
  async handleShippingStatusUpdated(payload: ShippingStatusUpdatedEvent) {
    const { orderId } = payload;

    const order = await this.prisma.order.findUnique({
      where: { Order_ID: orderId },
      include: {
        shipping: true,
        customer: true,
      },
    });

    if (!order) {
      this.logger.warn(`Order ${orderId} not found`);
      return;
    }

    const shipping = order.shipping[0];
    if (!shipping) {
      this.logger.warn(`Shipping for order ${orderId} not found`);
      return;
    }

    this.logger.log(`Ship_Status from DB: "${shipping.Ship_Status}" | customer: ${order.customer?.Customer_ID}`);
    switch (shipping.Ship_Status) {
      case ShippingStatus.SHIPPED:
        await this.notificationService.sendToCustomer(
          order.customer.Customer_ID,
          'Order shipped',
          `Your order ${orderId} has been shipped`,
        );
        break;
      case ShippingStatus.DELIVERED:
        this.notificationService.sendToCustomer(
          order.customer.Customer_ID,
          'Order delivered',
          `Your order ${orderId} has been delivered`,
        );
        break;
      case ShippingStatus.RETURNED:
        this.notificationService.sendToCustomer(
          order.customer.Customer_ID,
          'Order returned',
          `Your order ${orderId} has been received and a refund will be issued shortly`,
        );
        break;
      default:
        break;
    }
  }
}
