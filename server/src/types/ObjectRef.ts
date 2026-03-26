import { ApiProperty } from '@nestjs/swagger';

export class ObjectRef {
  @ApiProperty({ type: String, required: true })
  key: string;
  @ApiProperty({ type: String, required: true })
  value: string;
}
