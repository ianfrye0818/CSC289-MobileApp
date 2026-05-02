import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendNotificationRequestDto {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  body: string;
}
