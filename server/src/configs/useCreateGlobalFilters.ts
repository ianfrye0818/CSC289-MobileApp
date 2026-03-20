import {
  PrismaKnownExceptionFilter,
  PrismaKnownRequestExceptionFilter,
  PrismaUnknownRequestExceptionFilter,
} from '@/filters/PrismaKnownExceptions.filter';
import { INestApplication } from '@nestjs/common';

/**
 * Registers all global exception filters on the NestJS application.
 *
 * Called once during bootstrap. Prisma can throw three distinct error classes —
 * each is handled by its own filter so the error mapping logic stays focused.
 * All three are registered here so no Prisma error reaches the default NestJS
 * error handler (which would return a generic 500).
 */
export const useGlobalFilters = (app: INestApplication) => {
  app.useGlobalFilters(new PrismaKnownExceptionFilter());
  app.useGlobalFilters(new PrismaKnownRequestExceptionFilter());
  app.useGlobalFilters(new PrismaUnknownRequestExceptionFilter());
};
