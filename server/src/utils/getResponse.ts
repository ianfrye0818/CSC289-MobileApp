import { ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

/**
 * Extracts the typed Express `Response` object from a NestJS `ExecutionContext`.
 *
 * Companion to `getRequest` — use this in interceptors or filters that need to
 * directly write to the response (e.g. set headers or call `res.json()`).
 *
 * @param context - The NestJS execution context provided to interceptors/filters.
 * @returns The Express `Response` object for the current HTTP call.
 */
export const getResponse = (context: ExecutionContext): Response => {
  return context.switchToHttp().getResponse();
};
