import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extracts the typed Express `Request` object from a NestJS `ExecutionContext`.
 *
 * Guards, interceptors, and decorators all receive an `ExecutionContext` rather
 * than a raw request object. This helper centralises the `.switchToHttp().getRequest()`
 * boilerplate so it only needs to be written once.
 *
 * @param context - The NestJS execution context provided to guards/interceptors.
 * @returns The Express `Request` object for the current HTTP call.
 */
export const getRequest = (context: ExecutionContext): Request => {
  return context.switchToHttp().getRequest();
};
