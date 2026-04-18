import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationsController } from './Notifications.controller';
import { RegisterPushTokenCommandHandler } from './commands/RegisterPushToken/RegisterPushTokenCommandHandler';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationsController],
  providers: [RegisterPushTokenCommandHandler],
})
export class NotificationsModule {}
