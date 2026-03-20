import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemToCartCommand } from './AddItemToCartCommand';

/**
 * Handles `AddItemToCartCommand` — adds a product to the customer's cart or
 * increments its quantity if it is already present.
 *
 * Steps:
 * 1. Find the first `Inventory` record for the given `productId`.
 * 2. Reject with 400 if the product is out of stock (`Quantity <= 0`).
 * 3. Upsert the `Shopping_Cart_Item` by composite key (`Cart_ID + Inventory_ID`):
 *    - **Exists** → increment `Quantity` by the requested amount.
 *    - **New** → create a new cart item with the requested quantity.
 */
@CommandHandler(AddItemToCartCommand)
export class AddItemToCartCommandHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: AddItemToCartCommand,
  ): Promise<UpdatedMessageResponse> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        Product_ID: command.dto.productId,
      },
    });

    if (!inventory || inventory.Quantity <= 0)
      throw new BadRequestException('Product is out of stock');

    const cartItem = await this.prisma.shopping_Cart_Item.upsert({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: inventory.Inventory_ID,
        },
      },
      update: {
        Quantity: {
          increment: command.dto.quantity,
        },
      },
      create: {
        Cart_ID: command.cart.Cart_ID,
        Inventory_ID: inventory.Inventory_ID,
        Quantity: command.dto.quantity,
      },
    });

    return new UpdatedMessageResponse(
      'Item added to cart successfully',
      cartItem.Cart_ID,
    );
  }
}
