import { Command } from '@nestjs/cqrs';
import { EmitEventRequestDto } from '../../dtos/EmitEventRequestDto';

export class EmitWebhookEventCommand extends Command<void> {
  constructor(public readonly dto: EmitEventRequestDto) {
    super();
  }
}
