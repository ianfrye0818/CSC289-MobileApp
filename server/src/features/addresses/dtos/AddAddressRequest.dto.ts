import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddAddressRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  country?: string;
}
