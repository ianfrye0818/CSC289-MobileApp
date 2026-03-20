import { Command } from '@nestjs/cqrs';
import { IsEmail } from 'class-validator';

/**
 * Request body DTO for the `POST /auth/login` endpoint.
 * `class-validator` enforces the `@IsEmail()` constraint via the global
 * `ValidationPipe` before the command handler ever runs.
 */
export class LoginUserCommandRequestDto {
  @IsEmail()
  email: string;
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
