import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  phone?: string;

}