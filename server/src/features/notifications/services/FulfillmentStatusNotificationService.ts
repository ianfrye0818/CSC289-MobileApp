import { AppLogger } from '@/services/AppLogger.service';
import { PrismaService } from '@/services/Prisma.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpoPushService } from './ExpoPushService';

/**
 * Transitions that fire a push notification.
 *
 * Fulfillment_Status values per the Shipping team's enum:
 *   Pending → Processing → Packed → ReadyToShip → Fulfilled
 *
 * Customer-facing notifications start at Processing (order creation is
 * silent because Pending is the default and customers don't need to be
 * told their brand new order is pending).
 */
const NOTIFY_ON_STATUSES: Record<
  string,
  { title: string; body: (orderId: number) => string }
> = {
  Processing: {
    title: 'Order update',
    body: (orderId) => `Your order #${orderId} is being prepared.`,
  },
  Packed: {
    title: 'Order update',
    body: (orderId) => `Your order #${orderId} is packed and ready to go out.`,
  },
  ReadyToShip: {
    title: 'Order update',
    body: (orderId) => `Your order #${orderId} is ready to ship.`,
  },
  Fulfilled: {
    title: 'Order shipped',
    body: (orderId) => `Your order #${orderId} has shipped.`,
  },
};

/**
 * Polls the Order table for Fulfillment_Status changes on a 5-minute
 * cron schedule and fires a push notification to the owning customer when
 * specific transitions are detected.
 *
 * Change detection uses an in-memory Map cache keyed by Order_ID. The
 * first scan after startup populates the cache silently; subsequent
 * scans fire pushes for any detected transitions.
 *
 * This service reads from the Order table and does not write to it.
 * Writes to Order.Fulfillment_Status come from the Shipping team's
 * Java app.
 */
@Injectable()
export class FulfillmentStatusNotificationService implements OnModuleInit {
  private readonly logger = new AppLogger(
    FulfillmentStatusNotificationService.name,
  );
  private readonly lastKnownStatus = new Map<number, string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly expoPush: ExpoPushService,
  ) {}

  async onModuleInit() {
    // Silent first scan — populate the cache without firing any pushes.
    this.logger.log('Starting silent first scan of Order.Fulfillment_Status');
    await this.scan(false);
    this.logger.log(
      `Initial cache populated with ${this.lastKnownStatus.size} orders`,
    );
    this.logger.log(
      `Fulfillment status polling scheduled (${CronExpression.EVERY_5_MINUTES})`,
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollFulfillmentStatus(): Promise<void> {
    try {
      await this.scan(true);
    } catch (err) {
      this.logger.error('Polling scan failed', err);
    }
  }

  /**
   * Single scan pass. Queries all orders, compares each to the cached
   * state, fires notifications for tracked transitions, updates the cache.
   *
   * @param fireOnChange when false (first scan), no pushes are fired —
   *                    only the cache is populated
   */
  private async scan(fireOnChange: boolean): Promise<void> {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          Order_ID: true,
          Customer_ID: true,
          Fulfillment_Status: true,
        },
      });

      for (const order of orders) {
        const orderId = order.Order_ID;
        const currentStatus = order.Fulfillment_Status;
        const previousStatus = this.lastKnownStatus.get(orderId);

        // First sighting — just record and move on.
        if (previousStatus === undefined) {
          this.lastKnownStatus.set(orderId, currentStatus);
          continue;
        }

        // No change since last scan.
        if (previousStatus === currentStatus) {
          continue;
        }

        // Transition detected. Update cache first so a failed push doesn't
        // cause re-fires on the next scan.
        this.lastKnownStatus.set(orderId, currentStatus);

        if (!fireOnChange) {
          continue;
        }

        const notification = NOTIFY_ON_STATUSES[currentStatus];
        if (!notification) {
          // Transition to a status we don't notify on (e.g. back to Pending).
          // Cache is already updated; no push to fire.
          continue;
        }

        this.logger.log(
          `Order ${orderId}: ${previousStatus} -> ${currentStatus}, firing push`,
        );

        this.expoPush
          .sendToCustomer(
            order.Customer_ID,
            notification.title,
            notification.body(orderId),
            {
              type: 'fulfillment.status.updated',
              orderId,
              status: currentStatus,
            },
          )
          .catch((err) => {
            this.logger.error(
              `Failed to send fulfillment notification for order ${orderId}`,
              err,
            );
          });
      }
    } catch (err) {
      this.logger.error('Failed to query Order table during scan', err);
    }
  }
}
