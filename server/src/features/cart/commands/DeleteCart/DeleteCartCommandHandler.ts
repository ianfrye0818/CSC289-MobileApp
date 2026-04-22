import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCartCommand } from './DeleteCartCommand';

/**
 * Handles `DeleteCartCommand` — deletes the entire shopping cart record.
 *
 * `Shopping_Cart_Item` FK uses `onDelete: NoAction`, so line items must be
 * deleted before the cart row (same ordering as checkout in
 * `CreateOrderCommandHandler.clearCart`).
 */
@CommandHandler(DeleteCartCommand)
export class DeleteCartCommandHandler implements ICommandHandler<DeleteCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteCartCommand): Promise<DeletedMessageResponse> {
    await this.prisma.shopping_Cart_Item.deleteMany({
      where: { Cart_ID: command.cartId },
    });
    await this.prisma.shopping_Cart.deleteMany({
      where: {
        Cart_ID: command.cartId,
        Customer_ID: command.userId,
      },
    });

    return new DeletedMessageResponse(
      'Cart deleted successfully',
      command.cartId,
    );
  }
}
