import { ObjectRef } from '@/types/ObjectRef';
import { ApiProperty } from '@nestjs/swagger';

export class AddressListReponseDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: String, required: true })
  line1: string;

  @ApiProperty({ type: String, required: false })
  line2?: string;

  @ApiProperty({ type: String, required: true })
  city: string;

  @ApiProperty({ type: String, required: true })
  state: string;

  @ApiProperty({ type: String, required: true })
  zipcode: string;

  @ApiProperty({ type: String, required: false })
  country?: string;

  @ApiProperty({ type: ObjectRef, required: true })
  customerRef: ObjectRef;
}
