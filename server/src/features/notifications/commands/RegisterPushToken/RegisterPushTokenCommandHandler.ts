import { AppLogger } from '@/services/AppLogger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPushTokenCommand } from './RegisterPushTokenCommand';

/**
 * Handles `RegisterPushTokenCommand` — stores the device's Expo push token
 * so the server can send notifications to the correct device.
 *
 * Current implementation: in-memory Map.
 * TODO: Once the Push_Token column is approved on the Customer table,
 * migrate to a Prisma update against the Customer record.
 */
@CommandHandler(RegisterPushTokenCommand)
export class RegisterPushTokenCommandHandler implements ICommandHandler<RegisterPushTokenCommand> {
  /** In-memory token store. Key = Customer_ID, Value = Expo push token. */
  private static readonly tokens = new Map<number, string>();

  private readonly logger = new AppLogger(RegisterPushTokenCommandHandler.name);

  async execute(
    command: RegisterPushTokenCommand,
  ): Promise<{ message: string }> {
    RegisterPushTokenCommandHandler.tokens.set(
      command.customerId,
      command.token,
    );

    this.logger.log(`Push token registered for customer ${command.customerId}`);

    return { message: 'Push token registered successfully' };
  }

  /**
   * Retrieves the stored push token for a given customer.
   * Used by the PushNotificationService when sending notifications.
   */
  static getToken(customerId: number): string | undefined {
    return RegisterPushTokenCommandHandler.tokens.get(customerId);
  }
}
