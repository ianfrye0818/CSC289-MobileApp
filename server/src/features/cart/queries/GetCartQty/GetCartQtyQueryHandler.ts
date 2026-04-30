import { MOBILE_SESSION_ID } from '@/constants';
import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQtyQuery, GetCartQtyResponseDto } from './GetCartQtyQuery';

@QueryHandler(GetCartQtyQuery)
export class GetCartQtyQueryHandler implements IQueryHandler<GetCartQtyQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCartQtyQuery): Promise<GetCartQtyResponseDto | null> {
    const cart = await this.prisma.shopping_Cart.findFirst({
      where: {
        Customer_ID: query.customerId,
        Session_ID: MOBILE_SESSION_ID,
      },
      orderBy: {
        Created_At: 'desc',
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!cart) return null;

    return {
      cartId: cart.Cart_ID,
      qty: cart._count.items,
    };
  }
}
