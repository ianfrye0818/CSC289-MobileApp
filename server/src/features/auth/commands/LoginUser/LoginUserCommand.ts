import { Command } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Request body DTO for the `POST /auth/login` endpoint.
 * `class-validator` enforces the `@IsEmail()` constraint via the global
 * `ValidationPipe` before the command handler ever runs.
 */
export class LoginUserCommandRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

/**
 * CQRS command that triggers the login flow.
 *
 * Wraps the validated request DTO and is dispatched by `AuthController` via
 * the `CommandBus`. The generic type parameter `Command<string>` indicates that
 * `LoginUserCommandHandler` resolves with a JWT string.
 */
export class LoginUserCommand extends Command<string> {
  constructor(public readonly dto: LoginUserCommandRequestDto) {
    super();
  }
}
