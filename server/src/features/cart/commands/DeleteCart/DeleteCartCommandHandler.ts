import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCartCommand } from './DeleteCartCommand';

/**
 * Handles `DeleteCartCommand` — deletes the entire shopping cart record.
 *
 * Because `Shopping_Cart_Item` rows have a cascade delete relationship with
 * `Shopping_Cart`, all cart items are automatically removed when the cart is
 * deleted. This is also called internally by `CreateOrderCommandHandler` to
 * clear the cart after a successful checkout.
 */
@CommandHandler(DeleteCartCommand)
export class DeleteCartCommandHandler implements ICommandHandler<DeleteCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteCartCommand): Promise<DeletedMessageResponse> {
    await this.prisma.shopping_Cart.delete({
      where: {
        Cart_ID: command.cart.Cart_ID,
      },
    });

    return new DeletedMessageResponse(
      'Cart deleted successfully',
      command.cart.Cart_ID,
    );
  }
}
