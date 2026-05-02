import { AppLogger } from '@/services/AppLogger.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PushTokenService } from '../../../../services/PushTokenService';
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
  // private static readonly tokens = new Map<number, string>();

  private readonly logger = new AppLogger(RegisterPushTokenCommandHandler.name);
  constructor(private readonly tokenHandlerService: PushTokenService) {}

  async execute(
    command: RegisterPushTokenCommand,
  ): Promise<{ message: string }> {
    await this.tokenHandlerService.addToken(command.customerId, command.token);
    return { message: 'Push token registered successfully' };
  }

  //   // RegisterPushTokenCommandHandler.tokens.set(
  //   //   command.customerId,
  //   //   command.token,
  //   // );

  //   // See if the custoemr already has some push tokens registered
  //   const existingTokens = await this.redisService.hgetall(
  //     `push-tokens:${command.customerId}`,
  //   );
  //   if (existingTokens) {
  //     // Add the new token to the existing tokens
  //     await this.redisService.hset(`push-tokens:${command.customerId}`, {
  //       [command.token]: command.token,
  //     });
  //   } else {
  //     // Create a new hash for the customer
  //     await this.redisService.hset(`push-tokens:${command.customerId}`, {
  //       [command.token]: command.token,
  //     });
  //   }

  //   this.logger.log(`Push token registered for customer ${command.customerId}`);

  //   return { message: 'Push token registered successfully' };
  // }

  // public async getTokens(customerId: number): Promise<string[]> {
  //   const tokens = await this.redisService.hvals(`push-tokens:${customerId}`);
  //   return tokens.map((token) => token as string);
  // }

  // /**
  //  * Retrieves the stored push token for a given customer.
  //  * Used by the PushNotificationService when sending notifications.
  //  */
  // // static getToken(customerId: number): string | undefined {
  // //   return RegisterPushTokenCommandHandler.tokens.get(customerId);
  // // }
}
