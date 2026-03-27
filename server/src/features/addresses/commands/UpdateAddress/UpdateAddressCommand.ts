import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { UpdateAddressRequestDto } from '../../dtos/UpdateAddressRequest.dto';

export class UpdateAddressCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly addressId: number,
    public readonly dto: UpdateAddressRequestDto,
    public readonly userId: number,
  ) {
    super();
  }
}
