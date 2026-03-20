import { PUBLIC_KEY } from '@/decorators/Public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Global JWT authentication guard.
 *
 * Extends Passport's `AuthGuard('jwt')` with a `@Public()` escape hatch.
 * Before delegating to the standard JWT validation, it checks whether the
 * current route or controller is marked with `@Public()`. If it is, the request
 * is allowed through immediately without any token check.
 *
 * This guard is registered as an `APP_GUARD` in `AppModule`, so it runs for
 * every incoming request automatically.
 *
 * **Decision flow:**
 * 1. Check `@Public()` metadata on the handler or class → allow if present.
 * 2. Delegate to `super.canActivate()` → validates the JWT via `JwtStrategy`.
 * 3. If no token or invalid token → 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic ? true : super.canActivate(context);
  }
}
