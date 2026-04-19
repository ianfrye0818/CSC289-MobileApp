import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/Notifications.module';
import { CreateOrderCommandHandler } from './commands/CreateOrder/CreateOrderCommandHandler';
import { OrdersController } from './Orders.controller';
import { GetCurrentUserOrderDetailsQueryHandler } from './queries/GetCurrentUsersOrderDetails/GetCurrentUserOrderDetailsQueryHandler';
import { GetCurrentUsersOrdersQueryHandler } from './queries/GetCurrentUsersOrders/GetCurrentUsersOrdersQueryHandler';

@Module({
  // Imports NotificationsModule so CreateOrderCommandHandler can inject
  // ExpoPushService and fire an order.created push to the customer.
  imports: [NotificationsModule],
  providers: [
    GetCurrentUsersOrdersQueryHandler,
    CreateOrderCommandHandler,
    GetCurrentUserOrderDetailsQueryHandler,
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
