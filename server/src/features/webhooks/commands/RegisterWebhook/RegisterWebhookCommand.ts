import { Command } from '@nestjs/cqrs';
import { RegisterWebhookRequestDto } from '../../dtos/RegisterWebhookRequestDto';

export class RegisterWebhookCommand extends Command<void> {
  constructor(public readonly dto: RegisterWebhookRequestDto) {
    super();
  }
}
