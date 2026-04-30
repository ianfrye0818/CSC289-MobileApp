import { MOBILE_SESSION_ID } from '@/constants';
import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCurrentCustomersCartsCommand } from './DeleteCurrentUsersCartsCommand';

@CommandHandler(DeleteCurrentCustomersCartsCommand)
export class DeleteCurrentUsersCartsCommandHandler implements ICommandHandler<DeleteCurrentCustomersCartsCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: DeleteCurrentCustomersCartsCommand,
  ): Promise<DeletedMessageResponse> {
    const carts = await this.prisma.shopping_Cart.findMany({
      where: {
        Customer_ID: command.userId,
        Session_ID: MOBILE_SESSION_ID,
      },
    });

    await this.prisma.$transaction(async (tx) => {
      // Go through and delete all customers cart items and carts
      // This way we have no orphaned carts and potential orphaned cart items
      for (const cart of carts) {
        await tx.shopping_Cart_Item.deleteMany({
          where: { Cart_ID: cart.Cart_ID },
        });
        await tx.shopping_Cart.delete({
          where: { Cart_ID: cart.Cart_ID },
        });
      }

      // Create a new empty cart for the customer so they can use it later
      await tx.shopping_Cart.create({
        data: { Customer_ID: command.userId, Session_ID: MOBILE_SESSION_ID },
      });
    });

    return new DeletedMessageResponse('Carts deleted successfully');
  }
}
