import { Module } from '@nestjs/common';
import { GetOrderShippingStatusQueryHandler } from './GetOrdersShippingStatus/GetOrderShippingStatusQueryHandler';
import { UpdateShippingCommandHandler } from './UpdateShipping/UpdateShippingCommandHandler';
import { ShippingController } from './shippingcontroller';

@Module({
  providers: [GetOrderShippingStatusQueryHandler, UpdateShippingCommandHandler],
  controllers: [ShippingController],
})
export class ShippingModule {}
