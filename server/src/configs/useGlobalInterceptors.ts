import { BigIntInterceptor } from '@/interceptors/BigIntInterceptor';
import { INestApplication } from '@nestjs/common';

/**
 * Registers all global interceptors on the NestJS application.
 *
 * Called once during bootstrap. Add any new global interceptors here.
 * Currently registers:
 * - `BigIntInterceptor` — converts `BigInt` response values to strings so
 *   `JSON.stringify` doesn't throw.
 */
export const useGlobalInterceptors = (app: INestApplication) => {
  app.useGlobalInterceptors(new BigIntInterceptor());
};
