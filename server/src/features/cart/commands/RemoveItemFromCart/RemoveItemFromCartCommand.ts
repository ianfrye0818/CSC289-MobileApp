import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveItemFromCartRequestDto {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  inventoryId: number;
}

export class RemoveItemFromCartCommand extends Command<DeletedMessageResponse> {
  constructor(
    public readonly userId: number,
    public readonly dto: RemoveItemFromCartRequestDto,
  ) {
    super();
  }
}
