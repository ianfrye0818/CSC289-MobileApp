import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetCurrentCustomerCartQuery } from '../../queries/GetCurrentCustomerCart/GetCurrentCustomerCartQuery';
import { UpdateItemQuantityCommand } from './UpdateItemQuantityCommand';

/**
 * Handles `UpdateItemQuantityCommand` — sets the quantity of an existing cart
 * item to the value provided by the client (replaces rather than increments).
 *
 * Throws `NotFoundException` if no cart item exists for the given
 * `Cart_ID + Inventory_ID` composite key — prevents silent no-ops.
 */
@CommandHandler(UpdateItemQuantityCommand)
export class UpdateItemQuantityCommandHandler implements ICommandHandler<UpdateItemQuantityCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly querybus: QueryBus,
  ) {}

  async execute(
    command: UpdateItemQuantityCommand,
  ): Promise<UpdatedMessageResponse> {
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
      include: {
        cart: true,
        inventory: true,
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (cartItem.cart.Customer_ID !== command.userId)
      throw new ForbiddenException(
        'You are not authorized to update the quantity of this item in this cart.',
      );

    if (cartItem.inventory.Quantity - command.dto.quantity < 0)
      throw new BadRequestException(
        'There is not enough inventory to complete this request.',
      );

    await this.prisma.shopping_Cart_Item.update({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: cart.cartId,
          Inventory_ID: command.dto.inventoryId,
        },
      },
      data: {
        Quantity: command.dto.quantity,
      },
    });

    return new UpdatedMessageResponse(
      'Cart item quantity updated successfully',
      cart.cartId,
    );
  }
}
