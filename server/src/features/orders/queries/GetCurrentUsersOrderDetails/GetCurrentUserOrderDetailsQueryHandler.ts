import { PrismaService } from '@/services/Prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderDetailsResponseDto } from '../../dtos/OrderDetailsReponse.dto';
import { PaymentStatus } from '../../dtos/PaytmentStatus.enum';
import { ShippingStatus } from '../../dtos/ShippingStatus.enum';
import { calculateOrderAmount } from '../../utils/CalculateOrderAmount';
import { GetCurrentUserOrderDetailsQuery } from './GetCurrentUserOrderDetailsQuery';

/**
 * Handles `GetCurrentUserOrderDetailsQuery` — fetches the full detail view of a
 * single order including items, addresses, payment, and shipping.
 *
 * Ownership check: if the order's `Customer_ID` does not match the requesting
 * user's `id`, a 403 is thrown so customers cannot view each other's orders.
 *
 * All `Decimal` fields from Prisma are converted to plain `number` via
 * `.toNumber()` before returning — `Decimal` objects are not JSON-serialisable.
 *
 * Nullable relations (shipping, billing address) are mapped to `null` when not
 * present using the `??` operator to satisfy the DTO shape.
 */
@QueryHandler(GetCurrentUserOrderDetailsQuery)
export class GetCurrentUserOrderDetailsQueryHandler implements IQueryHandler<GetCurrentUserOrderDetailsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentUserOrderDetailsQuery,
  ): Promise<OrderDetailsResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: {
        Order_ID: query.orderId,
      },
      include: {
        discounts: true,
        customer: true,
        items: {
          include: {
            inventory: {
              include: {
                product: true,
              },
            },
          },
        },
        payment: true,
        shipping: {
          include: {
            billingAddress: true,
            shippingAddress: true,
          },
        },
      },
    });

    if (!order)
      throw new NotFoundException(`Order with id ${query.orderId} not found`);

    if (order.Customer_ID !== query.customerId)
      throw new ForbiddenException(
        'You are not authorized to access this order',
      );

    return {
      id: order.Order_ID,
      /**
       * Explicitly convert to ISO string — class-transformer serialises
       * raw Date objects as `{}` which breaks the mobile client.
       * — D3adMan, ticket #15
       */
      orderDate: order.Order_Date,
      // Schema declares shipping/payment as arrays; take [0] for current single-record DTO assumption.
      billingAddress: {
        addressId: order.shipping?.[0]?.billingAddress.Address_ID ?? null,
        line1: order.shipping?.[0]?.billingAddress.Address_Line1 ?? null,
        line2: order.shipping?.[0]?.billingAddress.Address_Line2 ?? null,
        city: order.shipping?.[0]?.billingAddress.City ?? null,
        state: order.shipping?.[0]?.billingAddress.State ?? null,
        zipCode: order.shipping?.[0]?.billingAddress.Zip_Code ?? null,
        country: order.shipping?.[0]?.billingAddress.Country ?? null,
      },
      shippingAddress: {
        addressId: order.shipping?.[0]?.shippingAddress.Address_ID ?? null,
        line1: order.shipping?.[0]?.shippingAddress.Address_Line1 ?? null,
        line2: order.shipping?.[0]?.shippingAddress.Address_Line2 ?? null,
        city: order.shipping?.[0]?.shippingAddress.City ?? null,
        state: order.shipping?.[0]?.shippingAddress.State ?? null,
        zipCode: order.shipping?.[0]?.shippingAddress.Zip_Code ?? null,
        country: order.shipping?.[0]?.shippingAddress.Country ?? null,
      },
      shipping: order.shipping
        ? {
            id: order.shipping?.[0]?.Shipping_ID ?? null,
            cost: order.shipping?.[0]?.Cost.toNumber() ?? 0,
            /* Same Date-to-string fix for shipping dates */
            shippedOn: order.shipping?.[0]?.Shipped_On ?? null,
            expectedBy: order.shipping?.[0]?.Expected_By ?? null,
            status: order.shipping?.[0]?.Ship_Status as ShippingStatus,
            carrier: order.shipping?.[0]?.Carrier ?? null,
            trackingNumber: order.shipping?.[0]?.Tracking_Number ?? null,
          }
        : null,
      customer: {
        id: order.customer.Customer_ID,
        email: order.customer.Email,
        name: `${order.customer.First_Name} ${order.customer.Last_Name}`,
      },
      discounts: order.discounts.map((discount) => ({
        id: discount.Discount_ID,
        type: discount.Discount_Type,
        amount: discount.Amount.toNumber(),
      })),
      items: order.items.map((item) => ({
        id: item.Inventory_ID ?? 0,
        name:
          item.inventory?.product?.Product_Name ??
          'Product details unavailable',
        quantity: item.Quantity,
        price: item.Amount.toNumber(),
        tax: item.Tax?.toNumber() ?? null,
      })),
      payment: {
        id: order.payment?.[0]?.Payment_ID ?? 0,
        method: order.payment?.[0]?.Method ?? '',
        status: order.payment?.[0]?.Payment_Status as PaymentStatus,
      },
      totalAmount: calculateOrderAmount(order.items, order.shipping?.[0]?.Cost.toNumber() ?? 0),
    };
  }
}
