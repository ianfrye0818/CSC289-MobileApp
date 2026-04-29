import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { UpdateItemQuantityRequestDto } from '../../dtos/UpdateItemQuantityRequest.dto';

export class UpdateItemQuantityCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly userId: number,
    public readonly dto: UpdateItemQuantityRequestDto,
  ) {
    super();
  }
}
