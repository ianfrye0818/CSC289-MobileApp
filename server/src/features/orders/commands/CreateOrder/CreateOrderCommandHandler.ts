import { TAX_RATE } from '@/constants';
import { ExpoPushService } from '@/features/notifications/services/ExpoPushService';
import { AppLogger } from '@/services/AppLogger.service';
import { PrismaService, TX } from '@/services/Prisma.service';
import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { Order_Item, Prisma } from '@generated/prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentMethod } from '../../dtos/PaymentMethod.dto';
import { PaymentStatus } from '../../dtos/PaytmentStatus.enum';
import { CreateOrderCommand } from './CreateOrderCommand';

export type DbOrder = Prisma.OrderGetPayload<{
  include: {
    items: true;
    payment: true;
  };
}>;
/**
 * Handles `CreateOrderCommand` — converts a shopping cart into a confirmed order.
 *
 * The entire checkout flow runs inside a Prisma transaction so that either all
 * steps succeed together or the database is left unchanged:
 *
 * 1. **Validate cart** — confirms the cart exists and belongs to the requesting
 *    customer (403 if mismatched, 404 if not found).
 * 2. **Create order** — inserts an `Order` with one `Order_Item` per cart line,
 *    capturing the unit price and applying `TAX_RATE` at the time of purchase.
 * 3. **Mock payment** — creates a `Payment` record with status `COMPLETED`.
 *    In a real app this is where a payment gateway (Stripe, etc.) would be called.
 * 4. **Clear cart** — deletes the cart (cascades to its items).
 * 5. **Update inventory** — decrements the `Quantity` on each `Inventory` record
 *    by the purchased amount.
 */
@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new AppLogger(CreateOrderCommandHandler.name);
  constructor(
    private readonly prisma: PrismaService,
    // Direct-send path for order.created push notification (ticket 53).
    // Ian's webhook emitter below is intentionally left commented-out.
    private readonly expoPush: ExpoPushService,
    // private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateOrderCommand): Promise<CreatedMessageResponse> {
    const cart = await this.prisma.shopping_Cart.findUnique({
      where: {
        Cart_ID: command.dto.cartId,
      },
      include: {
        items: {
          include: {
            inventory: true,
          },
        },
      },
    });

    if (!cart)
      throw new NotFoundException(
        `Cart with id ${command.dto.cartId} not found`,
      );
    if (cart.Customer_ID !== command.customerId)
      throw new ForbiddenException(
        'You are not authorized to create an order for this cart',
      );

    const orderData: Prisma.OrderCreateInput = {
      customer: {
        connect: {
          Customer_ID: command.customerId,
        },
      },
      items: {
        createMany: {
          data: cart.items.map((i) => ({
            Inventory_ID: i.Inventory_ID,
            Quantity: i.Quantity,
            Amount: i.inventory.Unit_Price,
            Tax: i.inventory.Unit_Price?.toNumber() ?? 0 * TAX_RATE,
            Created_At: new Date(),
            Updated_At: new Date(),
          })),
        },
      },
    };

    const transaction = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const createdOrder = await tx.order.create({
        data: orderData,
        include: {
          items: true,
          payment: true,
        },
      });

      // Create the payment - in a real app we would use a payment gateway and get a response but we are mocking it in this project.
      await this.createPayment(
        tx,
        createdOrder.Order_ID,
        command.dto.paymentMethod,
      );

      // Clear the shopping cart
      await this.clearCart(tx, command.dto.cartId);
      // Update the inventory quantites
      await this.updateInventory(tx, createdOrder.items);

      // await this.emitWebhook(createdOrder);

      return createdOrder;
    });

    // Fire-and-forget: send an order.created push to the customer. Not awaited
    // and errors are swallowed inside ExpoPushService so notification failure
    // never blocks the order-creation response. Direct Expo path (ticket 53)
    // rather than the commented `emitWebhook` call above — that's Ian's work.
    this.expoPush
      .notifyOrderCreated(command.customerId, transaction.Order_ID)
      .catch((e) => this.logger.error('Order notification failed:', e));

    return new CreatedMessageResponse(
      'Order created successfully',
      transaction.Order_ID,
    );
  }

  /**
   * Emits a webhook event for the order creation.
   * @param order - The order to emit the webhook event for.
   * @error - Fail silently so that we don't block the order creation.
   */
  // private async emitWebhook(order: DbOrder): Promise<void> {
  //   try {
  //     await this.commandBus.execute(
  //       new EmitWebhookEventCommand({
  //         event: 'order.created',
  //         payload: {
  //           orderId: order.Order_ID,
  //           customerId: order.Customer_ID,
  //           paymentMethod: order.payment?.Method as PaymentMethod,
  //           totalAmount: order.items.reduce(
  //             (acc, item) =>
  //               acc +
  //               item.Amount.toNumber() *
  //                 item.Quantity *
  //                 (1 + item.Tax.toNumber()),
  //             0,
  //           ),
  //           items: order.items.map((item) => ({
  //             inventoryId: item.Inventory_ID,
  //             quantity: item.Quantity,
  //             amount: item.Amount,
  //             tax: item.Tax,
  //           })),
  //         },
  //       }),
  //     );
  //   } catch (error) {
  //     this.logger.error(
  //       `Error emitting webhook event for order ${order.Order_ID}: ${error}`,
  //     );
  //   }
  // }

  /**
   * Creates a mock payment record for the order.
   * Status is hardcoded to `COMPLETED` because this project does not integrate
   * with a real payment gateway. Replace this with actual gateway logic when
   * moving toward production.
   */
  private async createPayment(
    tx: TX,
    orderId: number,
    paymentMethod: PaymentMethod,
  ) {
    await tx.payment.create({
      data: {
        Order_ID: orderId,
        Payment_Status: PaymentStatus.COMPLETED, // Since this is a mock payment, we are just assuming it was completed.
        Method: paymentMethod,
        Created_At: new Date(),
        Updated_At: new Date(),
      },
    });
  }

  /** Deletes the shopping cart (cascade removes all items). */
  private async clearCart(tx: TX, cartId: number): Promise<void> {
    await tx.shopping_Cart.delete({
      where: {
        Cart_ID: cartId,
      },
    });
  }

  /**
   * Decrements inventory quantities for each purchased item.
   * Runs sequentially inside the transaction — if any update fails, the whole
   * transaction rolls back and inventory is not partially decremented.
   */
  private async updateInventory(tx: TX, items: Order_Item[]): Promise<void> {
    for (const item of items) {
      await tx.inventory.update({
        where: {
          Inventory_ID: item.Inventory_ID,
        },
        data: {
          Quantity: {
            decrement: item.Quantity,
          },
        },
      });
    }
  }
}
