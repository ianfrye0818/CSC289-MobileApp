import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemFromCartCommand } from './RemoveItemFromCartCommand';

/**
 * Handles `RemoveItemFromCartCommand` — permanently deletes a single item from
 * the customer's cart by its composite key (`Cart_ID + Inventory_ID`).
 *
 * The cart itself is NOT deleted; only the specific line item is removed.
 * To clear the entire cart use `DeleteCartCommand` instead.
 */
@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartCommandHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: RemoveItemFromCartCommand,
  ): Promise<DeletedMessageResponse> {
    await this.prisma.shopping_Cart_Item.delete({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: command.inventoryId,
        },
      },
    });

    return new DeletedMessageResponse('Item removed from cart successfully');
  }
}
