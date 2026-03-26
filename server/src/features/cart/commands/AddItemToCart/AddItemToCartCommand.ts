import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Shopping_Cart } from '@generated/prisma/client';
import { Command } from '@nestjs/cqrs';
import { AddItemToCartRequestDto } from '../../dtos/AddItemToCartRequest.dto';

export class AddItemToCartCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly cart: Shopping_Cart,
    public readonly dto: AddItemToCartRequestDto,
  ) {
    super();
  }
}
