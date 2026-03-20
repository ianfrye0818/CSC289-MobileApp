import { Global, Module } from '@nestjs/common';
import { AppLogger } from './AppLogger.service';
import { PrismaService } from './Prisma.service';

/**
 * Global module that makes `PrismaService` and `AppLogger` available
 * application-wide without re-importing them in every feature module.
 *
 * Because this module is decorated with `@Global()` and imported once in
 * `AppModule`, any other module can inject `PrismaService` or `AppLogger`
 * directly — no extra imports required.
 */
@Global()
@Module({
  providers: [PrismaService, AppLogger],
  exports: [PrismaService, AppLogger],
})
export class GlobalServicesModule {}
