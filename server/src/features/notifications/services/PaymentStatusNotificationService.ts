import { AppLogger } from '@/services/AppLogger.service';
import { PrismaService } from '@/services/Prisma.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpoPushService } from './ExpoPushService';

/**
 * Payment_Status transitions that fire a push notification.
 *
 * Silent on: Pending, Processing (internal workflow states).
 * Fires on: Completed, Cancelled, Refunded, Failed.
 */
const NOTIFY_ON_STATUSES: Record<
  string,
  { title: string; body: (orderId: number) => string }
> = {
  Completed: {
    title: 'Payment received',
    body: (orderId) => `Your payment for order #${orderId} has been processed.`,
  },
  Cancelled: {
    title: 'Payment cancelled',
    body: (orderId) =>
      `The payment for your order #${orderId} has been cancelled.`,
  },
  Refunded: {
    title: 'Refund issued',
    body: (orderId) => `A refund has been issued for order #${orderId}.`,
  },
  Failed: {
    title: 'Payment failed',
    body: (orderId) =>
      `We couldn't process payment for your order #${orderId}. Please update your payment method.`,
  },
};

/**
 * Polls the Payment table for Payment_Status changes on a 5-minute
 * cron schedule and fires a push notification to the owning customer when
 * specific transitions are detected.
 *
 * Resolves the customer by joining Payment back through its Order row
 * to get Customer_ID. Uses an in-memory Map cache keyed by Payment_ID
 * for change detection. First scan after startup is silent; subsequent
 * scans fire pushes for any new transitions.
 */
@Injectable()
export class PaymentStatusNotificationService implements OnModuleInit {
  private readonly logger = new AppLogger(
    PaymentStatusNotificationService.name,
  );
  private readonly lastKnownStatus = new Map<number, string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly expoPush: ExpoPushService,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting silent first scan of Payment.Payment_Status');
    await this.scan(false);
    this.logger.log(
      `Initial cache populated with ${this.lastKnownStatus.size} payments`,
    );
    this.logger.log(
      `Payment status polling scheduled (${CronExpression.EVERY_5_MINUTES})`,
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollPaymentStatus(): Promise<void> {
    try {
      await this.scan(true);
    } catch (err) {
      this.logger.error('Polling scan failed', err);
    }
  }

  private async scan(fireOnChange: boolean): Promise<void> {
    try {
      const payments = await this.prisma.payment.findMany({
        select: {
          Payment_ID: true,
          Order_ID: true,
          Payment_Status: true,
          order: {
            select: {
              Customer_ID: true,
            },
          },
        },
      });

      for (const payment of payments) {
        const paymentId = payment.Payment_ID;
        const currentStatus = payment.Payment_Status;

        // Payment_Status is nullable in the schema — treat null as "no
        // observable state" and skip. We only track real values.
        if (!currentStatus) {
          continue;
        }

        const previousStatus = this.lastKnownStatus.get(paymentId);

        if (previousStatus === undefined) {
          this.lastKnownStatus.set(paymentId, currentStatus);
          continue;
        }

        if (previousStatus === currentStatus) {
          continue;
        }

        // Transition detected. Update cache first.
        this.lastKnownStatus.set(paymentId, currentStatus);

        if (!fireOnChange) {
          continue;
        }

        const notification = NOTIFY_ON_STATUSES[currentStatus];
        if (!notification) {
          // Transition to a status we don't notify on (e.g. Pending,
          // Processing). Cache updated, no push fired.
          continue;
        }

        if (!payment.order) {
          this.logger.warn(
            `Payment ${paymentId} has no associated order; skipping push`,
          );
          continue;
        }

        this.logger.log(
          `Payment ${paymentId} (Order ${payment.Order_ID}): ${previousStatus} -> ${currentStatus}, firing push`,
        );

        this.expoPush
          .sendToCustomer(
            payment.order.Customer_ID,
            notification.title,
            notification.body(payment.Order_ID),
            {
              type: 'payment.status.updated',
              paymentId,
              orderId: payment.Order_ID,
              status: currentStatus,
            },
          )
          .catch((err) => {
            this.logger.error(
              `Failed to send payment notification for payment ${paymentId}`,
              err,
            );
          });
      }
    } catch (err) {
      this.logger.error('Failed to query Payment table during scan', err);
    }
  }
}
