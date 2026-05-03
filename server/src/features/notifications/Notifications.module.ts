import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsController } from './Notifications.controller';
import { RegisterPushTokenCommandHandler } from './commands/RegisterPushToken/RegisterPushTokenCommandHandler';
import { SendNotificationCommandHandler } from './commands/SendNotification/SendNotificationCommandHandler';
import { ExpoPushService } from './services/ExpoPushService';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationsController],
  // ExpoPushService is exported so other feature modules (e.g. OrdersModule)
  // can inject it to fire notifications on domain events — direct-send path,
  // bypasses Ian's in-progress webhook module by design.
  providers: [
    RegisterPushTokenCommandHandler,
    ExpoPushService,
    SendNotificationCommandHandler,
  ],
  exports: [ExpoPushService],
})
export class NotificationsModule {}
