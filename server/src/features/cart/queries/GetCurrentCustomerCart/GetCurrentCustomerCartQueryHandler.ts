import { PrismaService } from '@/services/Prisma.service';
import { Prisma } from '@generated/prisma/client';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  CartItemDiscountDto,
  CartItemDto,
  CartItemProductDto,
  ShoppingCartResponseDto,
} from '../../dtos/ShoppingCartResponse.dto';
import { GetCurrentCustomerCartQuery } from './GetCurrentCustomerCartQuery';

/** Matches `include.items` when loading a cart — used only for typings. */
const cartLineInclude = {
  inventory: {
    include: {
      product: {
        include: {
          category: true,
          discounts: true,
          supplier: true,
        },
      },
    },
  },
} satisfies Prisma.Shopping_Cart_ItemInclude;

type CartLineRow = Prisma.Shopping_Cart_ItemGetPayload<{
  include: typeof cartLineInclude;
}>;

type CartDiscountRow = NonNullable<
  NonNullable<CartLineRow['inventory']>['product']
>['discounts'][number];

/**
 * Handles `GetCurrentCustomerCartQuery` — fetches the most recent active cart
 * for the authenticated customer including full product details.
 *
 * The query eagerly loads the full relation chain:
 * `Shopping_Cart → items → inventory → product → (category, discounts, supplier)`
 *
 * The handler then projects this into a flat `ShoppingCartResponseDto` that
 * includes calculated `lineTotal` (unit price × quantity), `subtotal`, and
 * `totalItems` so the mobile app doesn't need to recalculate these.
 *
 * If the customer has no cart row yet, returns an empty payload with `cartId: null`
 * (checkout/add-item flows create the cart on demand).
 */
@QueryHandler(GetCurrentCustomerCartQuery)
export class GetCurrentCustomerCartQueryHandler implements IQueryHandler<GetCurrentCustomerCartQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentCustomerCartQuery,
  ): Promise<ShoppingCartResponseDto> {
    console.log({ query });
    let cart = await this.prisma.shopping_Cart.findFirst({
      where: {
        Customer_ID: query.customerId,
      },
      include: {
        items: {
          include: cartLineInclude,
        },
      },
      orderBy: {
        Created_At: 'desc',
      },
    });

    if (!cart) {
      // Create a new cart
      cart = await this.prisma.shopping_Cart.create({
        data: {
          Customer_ID: query.customerId,
        },
        include: {
          items: {
            include: cartLineInclude,
          },
        },
      });
    }

    const items = (cart.items ?? []).map((item) => this.projectCartLine(item));
    const subtotal = items.reduce((sum, line) => sum + line.lineTotal, 0);
    const totalItems = items.reduce((sum, line) => sum + line.quantity, 0);

    return {
      cartId: cart.Cart_ID,
      customerId: cart.Customer_ID,
      items,
      subtotal,
      totalItems,
    };
  }

  /**
   * Gets the unit price from an inventory item.
   * @param item - The cart line row to get the unit price from.
   * @returns The unit price from the inventory item.
   */
  private unitPriceFromInventoryItem(item: CartLineRow): number {
    const raw = item.inventory?.Unit_Price;
    return raw != null ? Number(raw) : 0;
  }

  /**
   * Maps a cart discount row to a `CartItemDiscountDto`.
   * @param row - The cart discount row to map.
   * @returns The mapped cart discount DTO.
   */
  private mapDiscount(row: CartDiscountRow): CartItemDiscountDto {
    return {
      discountId: row.Discount_ID,
      discountType: row.Discount_Type as 'Percentage' | 'Flat',
      amount: Number(row.Amount),
      startDate: row.Start_Date,
      endDate: row.End_Date,
    };
  }

  /**
   * Maps a cart line row to a `CartItemProductDto`.
   * @param row - The cart line row to map.
   * @returns The mapped cart item product DTO.
   */
  private mapProduct(row: CartLineRow): CartItemProductDto {
    const p = row.inventory?.product;
    return {
      productId: p?.Product_ID,
      productName: p?.Product_Name,
      productDescription: p?.Product_Description,
      imageUrl: p?.Image_URL,
      categoryName: p?.category?.Category_Name ?? '-',
      discounts: (p?.discounts ?? []).map((d) => this.mapDiscount(d)),
    };
  }

  /**
   * Projects a cart line row to a `CartItemDto`.
   * @param item - The cart line row to project.
   * @returns The projected cart item DTO.
   */
  private projectCartLine(item: CartLineRow): CartItemDto {
    const unitPrice = this.unitPriceFromInventoryItem(item);
    return {
      inventoryId: item.Inventory_ID,
      quantity: item.Quantity,
      unitPrice,
      lineTotal: unitPrice * item.Quantity,
      product: this.mapProduct(item),
    };
  }
}
