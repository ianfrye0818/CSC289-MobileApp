import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExpoPushService } from '../../services/ExpoPushService';
import { SendNotificationCommand } from './SendNotificationCommand';

@CommandHandler(SendNotificationCommand)
export class SendNotificationCommandHandler implements ICommandHandler<SendNotificationCommand> {
  constructor(private readonly expoPushService: ExpoPushService) {}

  async execute(command: SendNotificationCommand): Promise<void> {
    const { dto } = command;
    await this.expoPushService.sendToCustomer(
      dto.customerId,
      dto.title,
      dto.body,
    );
  }
}
