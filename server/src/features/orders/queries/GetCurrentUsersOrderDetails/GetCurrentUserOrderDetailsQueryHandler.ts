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
      orderDate: order.Order_Date.toISOString(),
      billingAddress: {
        addressId: order.shipping?.billingAddress.Address_ID ?? null,
        line1: order.shipping?.billingAddress.Address_Line1 ?? null,
        line2: order.shipping?.billingAddress.Address_Line2 ?? null,
        city: order.shipping?.billingAddress.City ?? null,
        state: order.shipping?.billingAddress.State ?? null,
        zipCode: order.shipping?.billingAddress.Zip_Code ?? null,
        country: order.shipping?.billingAddress.Country ?? null,
      },
      shippingAddress: {
        addressId: order.shipping?.shippingAddress.Address_ID ?? null,
        line1: order.shipping?.shippingAddress.Address_Line1 ?? null,
        line2: order.shipping?.shippingAddress.Address_Line2 ?? null,
        city: order.shipping?.shippingAddress.City ?? null,
        state: order.shipping?.shippingAddress.State ?? null,
        zipCode: order.shipping?.shippingAddress.Zip_Code ?? null,
        country: order.shipping?.shippingAddress.Country ?? null,
      },
      shipping: order.shipping
        ? {
            id: order.shipping?.Shipping_ID ?? null,
            cost: order.shipping?.Cost.toNumber() ?? 0,
            /* Same Date-to-string fix for shipping dates */
            shippedOn: order.shipping?.Shipped_On?.toISOString() ?? null,
            expectedBy: order.shipping?.Expected_By?.toISOString() ?? null,
            status: order.shipping?.Ship_Status as ShippingStatus,
            carrier: order.shipping?.Carrier ?? null,
            trackingNumber: order.shipping?.Tracking_Number ?? null,
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
        id: item.Inventory_ID,
        name: item.inventory.product.Product_Name,
        quantity: item.Quantity,
        price: item.Amount.toNumber(),
        tax: item.Tax?.toNumber() ?? null,
      })),
      payment: {
        id: order.payment?.Payment_ID ?? 0,
        method: order.payment?.Method ?? '',
        status: order.payment?.Payment_Status as PaymentStatus,
      },
      totalAmount: calculateOrderAmount(order.items),
    };
  }
}
