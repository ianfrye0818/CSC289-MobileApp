import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';
import type { Request, Response } from 'express';

/**
 * Maps Prisma error codes to human-readable messages returned to the client.
 *
 * Prisma throws typed errors with short codes like `P2002` (unique constraint).
 * Without this map the raw Prisma error message (often a stack trace fragment)
 * would leak internal details to API consumers. The mapped messages are safe
 * and descriptive enough for the mobile app to display or log.
 *
 * Add new codes here as you encounter them. Full list:
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
const PrismaErrorCodeMap = {
  P2002: 'Unique constraint failed',
  P2003: 'Foreign key constraint failed',
  P2004: 'A database constraint failed',
  P2006: 'A Field Name is not valid',
  P2007: 'Data validation failed',
  P2008: 'Failed to parse query',
  P2011: 'Null Constraint Failed',
  P2012: 'Missing Required Path',
  P2013: 'Missing Required Argument',
  P2015: 'Missing Relationship',
  P2018: 'Related Records Not Found',
  P2024: 'Timout While Waiting For Resource',
  P2022: 'A record with this value already exists',
  P2033:
    "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
};

/**
 * Catches `PrismaClientValidationError` — thrown when query arguments fail
 * Prisma's own type-checking (e.g. wrong field name, invalid value type).
 * Returns HTTP 400 with the raw Prisma validation message.
 */
@Catch(PrismaClientValidationError)
export class PrismaKnownExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaKnownExceptionFilter.name, {
    timestamp: true,
  });
  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;

    this.logger.error({
      name: exception.name,
      message: exception.message,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}

/**
 * Catches `PrismaClientKnownRequestError` — database constraint violations and
 * other errors with a known Prisma error code (P2xxx).
 * Looks up the code in `PrismaErrorCodeMap` to return a friendly message
 * instead of the raw Prisma error, and always returns HTTP 400.
 */
@Catch(PrismaClientKnownRequestError)
export class PrismaKnownRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaKnownRequestExceptionFilter.name, {
    timestamp: true,
  });
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;

    let message = exception.message;
    const prismaCode = exception.code;
    if (prismaCode in PrismaErrorCodeMap) {
      message =
        PrismaErrorCodeMap[prismaCode as keyof typeof PrismaErrorCodeMap];
    }

    this.logger.error({
      name: exception.name,
      message,
      prismaCode,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

/**
 * Catches `PrismaClientUnknownRequestError` — unexpected database errors that
 * don't have a known Prisma error code. Still returns HTTP 400 with the
 * original message logged server-side for debugging.
 */
@Catch(PrismaClientUnknownRequestError)
export class PrismaUnknownRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    PrismaUnknownRequestExceptionFilter.name,
    {
      timestamp: true,
    },
  );
  catch(exception: PrismaClientUnknownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = HttpStatus.BAD_REQUEST;
    this.logger.error({
      name: exception.name,
      message: exception.message,
      originalPath: request.url,
      responseStatusCode: statusCode,
      responseMessage: exception.message,
    });

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
