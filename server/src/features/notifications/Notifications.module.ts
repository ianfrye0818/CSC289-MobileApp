import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsController } from './Notifications.controller';
import { RegisterPushTokenCommandHandler } from './commands/RegisterPushToken/RegisterPushTokenCommandHandler';
import { ExpoPushService } from './services/ExpoPushService';
import { FulfillmentStatusNotificationService } from './services/FulfillmentStatusNotificationService';
import { PaymentStatusNotificationService } from './services/PaymentStatusNotificationService';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationsController],
  // ExpoPushService is exported so other feature modules (e.g. OrdersModule)
  // can inject it to fire notifications on domain events — direct-send path,
  // bypasses Ian's in-progress webhook module by design.
  providers: [
    RegisterPushTokenCommandHandler,
    ExpoPushService,
    FulfillmentStatusNotificationService,
    PaymentStatusNotificationService,
  ],
  exports: [ExpoPushService],
})
export class NotificationsModule {}
