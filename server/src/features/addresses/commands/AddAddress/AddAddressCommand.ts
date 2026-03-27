import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { AddAddressRequestDto } from '../../dtos/AddAddressRequest.dto';

export class AddAddressCommand extends Command<CreatedMessageResponse> {
  constructor(
    public readonly dto: AddAddressRequestDto,
    public readonly userId: number,
  ) {
    super();
  }
}
