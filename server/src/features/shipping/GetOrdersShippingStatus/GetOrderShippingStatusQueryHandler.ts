import { ShippingCarrier } from '@/features/orders/dtos/ShippingCarrier.enum';
import { ShippingStatus } from '@/features/orders/dtos/ShippingStatus.enum';
import { PrismaService } from '@/services/Prisma.service';
import { Prisma } from '@generated/prisma/client';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersShippingStatusQuery } from './GetOrdersShippingStatusQuery';
import { GetOrdersShippingStatusResponse } from './Response';

@QueryHandler(GetOrdersShippingStatusQuery)
export class GetOrderShippingStatusQueryHandler implements IQueryHandler<GetOrdersShippingStatusQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetOrdersShippingStatusQuery,
  ): Promise<GetOrdersShippingStatusResponse[]> {
    const { request } = query;
    const where: Prisma.ShippingWhereInput = {};
    if (request.orderIds) {
      where.Order_ID = { in: request.orderIds };
    }

    const shipping = await this.prisma.shipping.findMany({
      where,
      include: {
        billingAddress: true,
        shippingAddress: true,
      },
    });

    return shipping.map((ship) => ({
      shippingId: ship.Shipping_ID,
      orderId: ship.Order_ID,
      status: ship.Ship_Status as ShippingStatus,
      cost: ship.Cost.toNumber(),
      shippedOn: ship.Shipped_On,
      expectedBy: ship.Expected_By,
      carrier: ship.Carrier as ShippingCarrier,
      trackingNumber: ship.Tracking_Number,
      notes: ship.Shipment_Notes,
      billingAddress: {
        addressId: ship.billingAddress.Address_ID,
        line1: ship.billingAddress.Address_Line1,
        line2: ship.billingAddress.Address_Line2,
        city: ship.billingAddress.City,
        state: ship.billingAddress.State,
        zipCode: ship.billingAddress.Zip_Code,
        country: ship.billingAddress.Country,
      },
      shippingAddress: {
        addressId: ship.shippingAddress.Address_ID,
        line1: ship.shippingAddress.Address_Line1,
        line2: ship.shippingAddress.Address_Line2,
        city: ship.shippingAddress.City,
        state: ship.shippingAddress.State,
        zipCode: ship.shippingAddress.Zip_Code,
        country: ship.shippingAddress.Country,
      },
    }));
  }
}
