import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderListResponseDto } from '../../dtos/OrderListResponse.dto';
import { calculateOrderAmount } from '../../utils/CalculateOrderAmount';
import { GetCurrentUsersOrdersQuery } from './GetCurrentUsersOrdersQuery';

/**
 * Handles `GetCurrentUsersOrdersQuery` — returns a list summary of all orders
 * placed by the authenticated customer.
 *
 * Calculates the `totalAmount` for each order using `calculateOrderAmount`
 * (which applies the stored per-item tax) and maps the Prisma result to the
 * flat `OrderListResponseDto` shape expected by the mobile app.
 */
@QueryHandler(GetCurrentUsersOrdersQuery)
export class GetCurrentUsersOrdersQueryHandler implements IQueryHandler<GetCurrentUsersOrdersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentUsersOrdersQuery,
  ): Promise<OrderListResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        Customer_ID: query.customerId,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // calcualte the total of each order based on the item amount * quantity * tax rate
    const ordersWithTotal = orders.map((order) => {
      const total = calculateOrderAmount(order.items);
      return {
        ...order,
        totalAmount: total,
      };
    });

    return ordersWithTotal.map((order) => ({
      id: order.Order_ID,
      customer: {
        id: order.customer.Customer_ID,
        email: order.customer.Email,
        name: `${order.customer.First_Name} ${order.customer.Last_Name}`,
      },
      /**
       * Explicitly convert to ISO string — class-transformer serialises
       * raw Date objects as `{}` which breaks the mobile client.
       * — D3adMan, ticket #14
       */
      orderDate: order.Order_Date,
      totalAmount: order.totalAmount,
    }));
  }
}
