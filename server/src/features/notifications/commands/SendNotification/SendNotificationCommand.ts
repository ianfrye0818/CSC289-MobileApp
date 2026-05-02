import { Command } from '@nestjs/cqrs';
import { SendNotificationRequestDto } from '../../dtos/SendNotificationRequest.dto';

export class SendNotificationCommand extends Command<void> {
  constructor(public readonly dto: SendNotificationRequestDto) {
    super();
  }
}
