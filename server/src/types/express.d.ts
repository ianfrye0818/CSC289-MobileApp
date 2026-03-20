import { AuthUserDto } from '@/features/auth/types/AuthUserDto.type';
import { Shopping_Cart } from '@generated/prisma';
import 'express';

/**
 * Extends the Express `Request` interface with app-specific properties.
 *
 * TypeScript module augmentation — this file merges two extra properties into
 * Express's `Request` type globally so controllers and guards can access them
 * with full type safety without casting.
 *
 * - `user` — populated by `JwtStrategy.validate()` after a successful JWT
 *   verification. `null` on unauthenticated / public routes.
 * - `cart` — populated by `CustomerCartGuard` before any cart route handler
 *   runs. `null` when no cart guard is active.
 */
declare module 'express' {
  interface Request {
    user: AuthUserDto | null;
    cart: Shopping_Cart | null;
  }
}
