import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used by `JwtAuthGuard` to identify public routes.
 * Kept as a constant so the guard and decorator stay in sync without
 * hardcoding a string in two places.
 */
export const PUBLIC_KEY = 'public';

/**
 * Route/controller decorator that marks an endpoint as publicly accessible,
 * bypassing the global `JwtAuthGuard`.
 *
 * By default every route in the app requires a valid JWT (because the guard is
 * registered globally in `AppModule`). Apply `@Public()` to any route that
 * should be accessible without authentication (e.g. login, product listing).
 *
 * @example
 * @Post('login')
 * @Public()
 * async login(@Body() body: LoginDto) { ... }
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
