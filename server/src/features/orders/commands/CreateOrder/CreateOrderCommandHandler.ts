import { TAX_RATE } from '@/constants';
import { ExpoPushService } from '@/features/notifications/services/ExpoPushService';
import { AppLogger } from '@/services/AppLogger.service';
import { PrismaService, TX } from '@/services/Prisma.service';
import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { ValueOf } from '@/types/ValueOf';
import { faker } from '@faker-js/faker';
import { Order_Item, Prisma } from '@generated/prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentMethod } from '../../dtos/PaymentMethod.enum';
import { PaymentStatus } from '../../dtos/PaytmentStatus.enum';
import {
  getRandomShippingCarrier,
  getRandomTrackingNumber,
} from '../../dtos/ShippingCarrier.enum';
import { ShippingStatus } from '../../dtos/ShippingStatus.enum';
import { CreateOrderCommand } from './CreateOrderCommand';

export type DbOrder = Prisma.OrderGetPayload<{
  include: {
    items: true;
    payment: true;
  };
}>;

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const ShippingCarrier = {
  DHL: 'DHL',
  UPS: 'UPS',
  FedEx: 'FedEx',
  USPS: 'USPS',
  DPD: 'DPD',
  Royal_Mail: 'Royal_Mail',
  Hermes: 'Hermes',
  DHL_Express: 'DHL_Express',
  UPS_Express: 'UPS_Express',
  FedEx_Express: 'FedEx_Express',
  USPS_Express: 'USPS_Express',
  DPD_Express: 'DPD_Express',
} as const;

export type ShippingCarrier = ValueOf<typeof ShippingCarrier>;

export const getRandomShippingCarrier = (): ShippingCarrier => {
  return pickRandom(Object.values(ShippingCarrier));
};

export const getRandomTrackingNumber = (): string => {
  return faker.string.alphanumeric(18).toUpperCase();
};
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
 * 4. **Clear cart** — deletes cart line items, then the cart row (FK is not cascading).
 * 5. **Update inventory** — decrements the `Quantity` on each `Inventory` record
 *    by the purchased amount.
 */
@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new AppLogger(CreateOrderCommandHandler.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly expoPush: ExpoPushService,
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

    for (const line of cart.items) {
      if (line.inventory.Quantity < line.Quantity) {
        throw new BadRequestException(
          `Insufficient stock for inventory ${line.Inventory_ID}: requested ${line.Quantity}, available ${line.inventory.Quantity}`,
        );
      }
    }

    const orderData: Prisma.OrderCreateInput = {
      customer: {
        connect: {
          Customer_ID: command.customerId,
        },
      },
      items: {
        createMany: {
          data: cart.items.map((i) => {
            const unit = i.inventory.Unit_Price?.toNumber() ?? 0;
            return {
              Inventory_ID: i.Inventory_ID,
              Quantity: i.Quantity,
              Amount: i.inventory.Unit_Price,
              // Line tax in dollars (matches client: subtotal × TAX_RATE, allocated per line).
              Tax: unit * i.Quantity * TAX_RATE,
              Created_At: new Date(),
              Updated_At: new Date(),
            };
          }),
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

      // Create shipping
      await this.createShipping(
        tx,
        createdOrder.Order_ID,
        command.dto.shippingAddressId,
        command.dto.billingAddressId,
        command.dto.shippingCost,
      );

      // Clear the shopping cart
      await this.clearCart(tx, command.dto.cartId);
      // Update the inventory quantites
      await this.updateInventory(tx, createdOrder.items);

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

  /**
   * Deletes the shopping cart and its line items.
   * `Shopping_Cart_Item` → `Shopping_Cart` uses `onDelete: NoAction`, so the DB
   * does not cascade; items must be removed before the parent cart row.
   */
  private async clearCart(tx: TX, cartId: number): Promise<void> {
    await tx.shopping_Cart_Item.deleteMany({
      where: { Cart_ID: cartId },
    });
    await tx.shopping_Cart.delete({
      where: { Cart_ID: cartId },
    });
  }

  /**
   * Decrements inventory quantities for each purchased item.
   * Runs sequentially inside the transaction — if any update fails, the whole
   * transaction rolls back and inventory is not partially decremented.
   */
  private async updateInventory(tx: TX, items: Order_Item[]): Promise<void> {
    for (const item of items) {
      const { count } = await tx.inventory.updateMany({
        where: {
          Inventory_ID: item.Inventory_ID,
          Quantity: { gte: item.Quantity },
        },
        data: {
          Quantity: { decrement: item.Quantity },
        },
      });
      if (count !== 1) {
        throw new BadRequestException(
          `Could not reserve inventory ${item.Inventory_ID} (quantity ${item.Quantity}); it may have sold out`,
        );
      }
    }
  }

  private async createShipping(
    tx: TX,
    orderId: number,
    shippingAddressId: number,
    billingAddressId: number,
    shippingCost: number,
  ) {
    const carrier = getRandomShippingCarrier();
    const trackingNumber = getRandomTrackingNumber();
    return await tx.shipping.create({
      data: {
        Order_ID: orderId,
        Cost: shippingCost,
        Ship_Status: ShippingStatus.PENDING,
        Carrier: carrier,
        Billing_Address_ID: billingAddressId,
        Shipping_Address_ID: shippingAddressId,
        Created_At: new Date(),
        Tracking_Number: trackingNumber,
      },
    });
  }
}
