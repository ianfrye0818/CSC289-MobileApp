import { Command } from '@nestjs/cqrs';
import { UpdateShippingRequest } from './UpdateShippingRequest';

export class UpdateShippingCommand extends Command<void> {
  constructor(public readonly dto: UpdateShippingRequest) {
    super();
  }
}
