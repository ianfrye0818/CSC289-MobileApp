import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetCurrentCustomerCartQuery } from '../../queries/GetCurrentCustomerCart/GetCurrentCustomerCartQuery';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly querybus: QueryBus,
  ) {}

  async execute(
    command: RemoveItemFromCartCommand,
  ): Promise<DeletedMessageResponse> {
    const cart = await this.querybus.execute(
      new GetCurrentCustomerCartQuery(command.userId),
    );
    const cartItem = await this.prisma.shopping_Cart_Item.findUnique({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: cart.cartId,
          Inventory_ID: command.dto.inventoryId,
        },
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.shopping_Cart_Item.delete({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: cart.cartId,
          Inventory_ID: command.dto.inventoryId,
        },
      },
    });

    return new DeletedMessageResponse('Item removed from cart successfully');
  }
}
