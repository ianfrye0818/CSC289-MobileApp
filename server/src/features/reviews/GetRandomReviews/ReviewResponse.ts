import { ObjectRef } from '@/types/ObjectRef';
import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: String, required: true })
  title: string;

  @ApiProperty({ type: String, required: true })
  content: string;

  @ApiProperty({ type: Number, required: true })
  rating: number;

  @ApiProperty({ type: ObjectRef, required: true })
  customer: ObjectRef;
}
