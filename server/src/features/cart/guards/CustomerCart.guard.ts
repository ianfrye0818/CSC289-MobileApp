import { PrismaService } from '@/services/Prisma.service';
import { getRequest } from '@/utils/getRequest';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

/**
 * Route guard that verifies the customer owns the cart they are trying to access.
 *
 * Reads the `cartId` path parameter, fetches the corresponding `Shopping_Cart`
 * from the database, and checks that its `Customer_ID` matches the authenticated
 * user's `id`. If both checks pass it attaches the cart to `request.cart` so
 * downstream handlers can access it via the `@Cart()` decorator without making
 * another database round-trip.
 *
 * Throws:
 * - `NotFoundException` (404) if the cart does not exist.
 * - `ForbiddenException` (403) if the cart belongs to a different customer.
 */
@Injectable()
export class CustomerCartGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context);
    const cartId = request.params.cartId;
    const user = request.user;

    const cart = await this.prisma.shopping_Cart.findUnique({
      where: {
        Cart_ID: Number(cartId),
      },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.Customer_ID !== user?.id)
      throw new ForbiddenException(
        'You are not authorized to access this cart',
      );

    // Attach to request so the @Cart() decorator can retrieve it without a DB hit
    request.cart = cart;
    return true;
  }
}
