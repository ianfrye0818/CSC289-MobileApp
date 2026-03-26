import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Shopping_Cart } from '@generated/prisma/client';
import { Command } from '@nestjs/cqrs';
import { UpdateItemQuantityRequestDto } from '../../dtos/UpdateItemQuantityRequest.dto';

export class UpdateItemQuantityCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly cart: Shopping_Cart,
    public readonly dto: UpdateItemQuantityRequestDto,
  ) {
    super();
  }
}
