import { ValidationPipe } from '@nestjs/common';

/**
 * Creates the global `ValidationPipe` used for all incoming request bodies.
 *
 * - `whitelist: true` — strips any properties that are not decorated in the DTO
 *   class, preventing unknown fields from reaching handlers.
 * - `forbidNonWhitelisted: true` — throws a 400 error if extra properties are
 *   sent (rather than silently stripping them). Helps catch client-side bugs
 *   early.
 * - `transform: true` — automatically transforms plain objects to their DTO
 *   class instances and coerces primitive types (e.g. route params to numbers).
 * - `enableCircularCheck: true` — prevents infinite loops if DTOs contain
 *   circular references.
 */
export const useValidationPipes = () => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableCircularCheck: true,
    },
  });
};
