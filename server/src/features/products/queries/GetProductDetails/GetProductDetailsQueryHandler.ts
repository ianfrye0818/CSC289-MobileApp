import { PrismaService } from '@/services/Prisma.service';
import { DiscountType } from '@/types/DiscountType.enum';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductDetailDto } from '../../dtos/ProductDetail.dto';
import { GetProductDetailsQuery } from './GetProductDetailsQuery';

/**
 * Handles `GetProductDetailsQuery` — returns full details for a single product.
 *
 * Includes all inventory records (each with quantity and unit price), all active
 * discounts, supplier info, and a `lowestPrice` convenience field derived from
 * the minimum unit price across all inventory records.
 *
 * Throws `NotFoundException` if no product with the given ID exists.
 */
@QueryHandler(GetProductDetailsQuery)
export class GetProductDetailsQueryHandler implements IQueryHandler<GetProductDetailsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetProductDetailsQuery): Promise<ProductDetailDto> {
    const product = await this.prisma.product.findUnique({
      where: {
        Product_ID: query.productId,
      },
      include: {
        category: true,
        inventory: true,
        discounts: true,
        supplier: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with id ${query.productId} not found`,
      );
    }

    const prices = product.inventory.map((i) => Number(i.Unit_Price));
    return {
      productId: product.Product_ID,
      productName: product.Product_Name,
      productDescription: product.Product_Description,
      imageUrl: product.Image_URL,
      category: product.category
        ? {
            categoryId: product.category.Category_ID,
            categoryName: product.category.Category_Name,
          }
        : null,
      supplier: {
        supplierId: product.supplier?.Supplier_ID ?? 0,
        supplierName: product.supplier?.Supplier_Name ?? '-',
      },
      inventory: product.inventory.map((i) => ({
        inventoryId: i.Inventory_ID,
        quantity: i.Quantity,
        unitPrice: Number(i.Unit_Price),
        inStock: i.Quantity > 0,
      })),
      discounts: product.discounts.map((d) => ({
        discountId: d.Discount_ID,
        discountType: d.Discount_Type as DiscountType,
        amount: Number(d.Amount),
        startDate: d.Start_Date,
        endDate: d.End_Date,
      })),
      lowestPrice: prices.length ? Math.min(...prices) : 0,
      inStock: product.inventory.some((i) => i.Quantity > 0),
    };
  }
}
