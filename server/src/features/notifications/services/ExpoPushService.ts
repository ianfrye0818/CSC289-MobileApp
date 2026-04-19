import { AppLogger } from '@/services/AppLogger.service';
import { Injectable } from '@nestjs/common';
import { RegisterPushTokenCommandHandler } from '../commands/RegisterPushToken/RegisterPushTokenCommandHandler';

// --- Expo activation site 1 of 3: import ---
// Uncomment this import together with sites 2 (class field) and 3 (send logic
// in sendToCustomer) once `npm install expo-server-sdk` has been run. All
// three sites must be uncommented together or the file will not compile.
// import { Expo, ExpoPushMessage } from 'expo-server-sdk';

/**
 * Sends push notifications to customers via the Expo Push API.
 *
 * Current state (2026-04-18) — STUB. Logs what would be sent but doesn't
 * actually call Expo. To enable real sends, run:
 *
 *     cd server && npm install expo-server-sdk
 *
 * and then uncomment the real-send block inside `sendToCustomer`. See
 * `.claude/pending-decisions/ticket-53-expo-server-sdk-install.md` for the
 * reasoning — the SDK wasn't installed as part of this branch because
 * `npm install` is an ask-first guarded operation and D3adMan was away.
 *
 * Lookups use the in-memory token store in `RegisterPushTokenCommandHandler`,
 * which loses state on server restart. Because the client re-registers its
 * token on every authenticated app launch, this is acceptable for the current
 * demo scale. See `.claude/audits/2026-04-18-full-build-audit.md` A2 for the
 * tradeoff discussion.
 */
@Injectable()
export class ExpoPushService {
  private readonly logger = new AppLogger(ExpoPushService.name);

  // --- Expo activation site 2 of 3: class field ---
  // Uncomment this field together with sites 1 (import) and 3 (send logic in
  // sendToCustomer) once `npm install expo-server-sdk` has been run. All three
  // sites must be uncommented together or the file will not compile.
  // private readonly expo = new Expo();

  /**
   * Fire-and-forget send to one customer's registered device. Errors are
   * logged but never thrown — notification failure must not block the
   * business flow that triggered it (e.g. order creation).
   */
  async sendToCustomer(
    customerId: number,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<void> {
    const token = RegisterPushTokenCommandHandler.getToken(customerId);
    if (!token) {
      this.logger.warn(
        `No push token registered for customer ${customerId}; skipping notification "${title}"`,
      );
      return;
    }

    // Basic format check — mirrors the DTO-level validation on the register endpoint.
    // Prevents calling out with obviously-bad tokens (e.g. "DEBUG").
    if (!/^ExponentPushToken\[[^\]]+\]$/.test(token)) {
      this.logger.warn(
        `Stored token for customer ${customerId} is not a valid Expo push token; skipping.`,
      );
      return;
    }

    // STUB: log the message that would be sent. Remove this line and
    // uncomment the real-send block below once expo-server-sdk is installed.
    this.logger.log(
      `[push:stub] → customer ${customerId}: title="${title}" body="${body}" data=${JSON.stringify(data ?? {})}`,
    );

    // --- Expo activation site 3 of 3: send logic ---
    // Uncomment this block together with sites 1 (import) and 2 (class field)
    // once `npm install expo-server-sdk` has been run, and remove the stub log
    // above. All three sites must be uncommented together or the file will not
    // compile.
    //
    // try {
    //   const messages: ExpoPushMessage[] = [
    //     { to: token, sound: 'default', title, body, data },
    //   ];
    //   const chunks = this.expo.chunkPushNotifications(messages);
    //   for (const chunk of chunks) {
    //     const tickets = await this.expo.sendPushNotificationsAsync(chunk);
    //     for (const ticket of tickets) {
    //       if (ticket.status === 'error') {
    //         this.logger.warn(
    //           `Expo rejected push for customer ${customerId}: ${ticket.message}`,
    //         );
    //       }
    //     }
    //   }
    // } catch (err) {
    //   this.logger.error(
    //     `Failed to send push to customer ${customerId}: ${(err as Error).message}`,
    //   );
    // }
  }

  /** Convenience wrapper for the order-created event. */
  async notifyOrderCreated(customerId: number, orderId: number): Promise<void> {
    await this.sendToCustomer(
      customerId,
      'Order confirmed',
      `Your order #${orderId} has been received.`,
      { type: 'order.created', orderId },
    );
  }
}
