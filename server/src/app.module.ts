import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressesModule } from './features/addresses/addresses.module';
import { AuthModule } from './features/auth/Auth.module';
import { JwtAuthGuard } from './features/auth/guards/Auth.guard';
import { CartModule } from './features/cart/Cart.module';
import { CustomerModule } from './features/customers/Customer.module';
import { NotificationsModule } from './features/notifications/Notifications.module';
import { OrdersModule } from './features/orders/Orders.module';
import { ProductsModule } from './features/products/Products.module';
import { HealthController } from './health.controller';
import { configSchema } from './services/ConfigService/Config.schema';
import { CustomConfigModule } from './services/ConfigService/CustomConfig.module';
import { GlobalServicesModule } from './services/GlobalServices.module';

/**
 * Root NestJS module — the top-level composition root for the entire server.
 *
 * **Imports:**
 * - `CustomConfigModule` — loads and validates all environment variables via
 *   Zod before any other module initialises.
 * - `CqrsModule` — enables the Command/Query bus used by every feature module.
 * - `GlobalServicesModule` — makes `PrismaService` and `AppLogger` available
 *   everywhere without re-importing them in each feature module.
 * - Feature modules (`Auth`, `Customer`, `Cart`, `Orders`, `Products`).
 *
 * **Global JWT guard:**
 * `JwtAuthGuard` is registered as an `APP_GUARD` provider, which means NestJS
 * applies it to *every* route automatically. Individual routes that should be
 * publicly accessible must be decorated with `@Public()` to opt out.
 */
@Module({
  imports: [
    CustomConfigModule.forRoot({
      schema: configSchema,
    }),
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    GlobalServicesModule,
    AuthModule,
    CustomerModule,
    CartModule,
    OrdersModule,
    ProductsModule,
    AddressesModule,
    NotificationsModule,

    // WebhooksModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      // Registers JwtAuthGuard globally so every route is protected by default.
      // Use @Public() on a route or controller to bypass this guard.
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
