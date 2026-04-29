import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';

export class DeleteCurrentCustomersCartsCommand extends Command<DeletedMessageResponse> {
  constructor(public readonly userId: number) {
    super();
  }
}
