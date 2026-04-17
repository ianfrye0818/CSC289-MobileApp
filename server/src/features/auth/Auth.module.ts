import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Auth.controller';
import { LoginUserCommandHandler } from './commands/LoginUser/LoginUserCommandHandler';
import { RegisterUserCommandHandler } from './commands/RegisterUser/RegisterUserCommandHandler';
import { JwtStrategy } from './jwt.strategy';

/**
 * Feature module for authentication.
 *
 * Registers:
 * - `PassportModule` — required peer for `@nestjs/passport` strategies.
 * - `JwtModule` — provides `JwtService` (used in `LoginUserCommandHandler` to
 *   sign tokens). Tokens expire in 30 days; change this for tighter security.
 * - `LoginUserCommandHandler` — CQRS handler for the login command.
 * - `JwtStrategy` — Passport strategy that validates incoming Bearer tokens.
 *
 * The `JwtAuthGuard` is NOT registered here — it lives in `AppModule` as a
 * global guard so it applies to every route without per-module imports.
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [LoginUserCommandHandler, RegisterUserCommandHandler, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
