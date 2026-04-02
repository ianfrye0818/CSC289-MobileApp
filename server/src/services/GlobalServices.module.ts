import { Global, Module } from '@nestjs/common';
import { AppLogger } from './AppLogger.service';
import { PrismaService } from './Prisma.service';
import { PushNotificationService } from './PushNotification.service';
import { RedisService } from './Redis.service';

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
  providers: [PrismaService, AppLogger, PushNotificationService, RedisService],
  exports: [PrismaService, AppLogger, PushNotificationService, RedisService],
})
export class GlobalServicesModule {}
