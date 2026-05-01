import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutUserRequestDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  pushToken?: string;
}
