import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserCommandRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class RegisterUserCommand extends Command<string> {
  constructor(public readonly dto: RegisterUserCommandRequestDto) {
    super();
  }
}
