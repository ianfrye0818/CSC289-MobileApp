import { PrismaService } from '@/services/Prisma.service';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ShoppingCartResponseDto } from '../../dtos/ShoppingCartResponse.dto';
import { GetCurrentCustomerCartQuery } from './GetCurrentCustomerCartQuery';

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
 * Throws `NotFoundException` if the customer has no active cart.
 */
@QueryHandler(GetCurrentCustomerCartQuery)
export class GetCurrentCustomerCartQueryHandler implements IQueryHandler<GetCurrentCustomerCartQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentCustomerCartQuery,
  ): Promise<ShoppingCartResponseDto> {
    const cart = await this.prisma.shopping_Cart.findFirst({
      where: {
        Customer_ID: query.customerId,
      },
      include: {
        items: {
          include: {
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
          },
        },
      },
      orderBy: {
        Created_At: 'desc',
      },
    });

    if (!cart)
      throw new NotFoundException(
        `No carts found for customer ${query.customerId}`,
      );

    return {
      cartId: cart.Cart_ID,
      customerId: cart.Customer_ID,
      items: cart.items.map((item) => {
        const unitPrice = Number(item.inventory.Unit_Price);
        const lineTotal = unitPrice * item.Quantity;

        return {
          inventoryId: item.Inventory_ID,
          quantity: item.Quantity,
          unitPrice,
          lineTotal,
          product: {
            productId: item.inventory.product.Product_ID,
            productName: item.inventory.product.Product_Name,
            productDescription: item.inventory.product.Product_Description,
            imageUrl: item.inventory.product.Image_URL,
            categoryName: item.inventory.product.category.Category_Name,
            discounts: item.inventory.product.discounts.map((d) => ({
              discountId: d.Discount_ID,
              discountType: d.Discount_Type as 'Percentage' | 'Flat',
              amount: Number(d.Amount),
              startDate: d.Start_Date,
              endDate: d.End_Date,
            })),
          },
        };
      }),
      subtotal: cart.items.reduce((sum, item) => {
        return sum + Number(item.inventory.Unit_Price) * item.Quantity;
      }, 0),
      totalItems: cart.items.reduce((sum, item) => sum + item.Quantity, 0),
    };
  }
}
