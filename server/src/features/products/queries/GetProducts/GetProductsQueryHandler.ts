import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductListItemDto } from '../../dtos/ProductListItem.dto';
import { GetProductsQuery } from './GetProductsQuery';

/**
 * Handles `GetProductsQuery` — returns a summary list of all products for the
 * product catalogue screen.
 *
 * `unitPrice` uses the first inventory record's price. Products may have
 * multiple inventory records (different sizes, colours, etc.) — the detail
 * endpoint exposes all of them. The list view shows only the first as a preview.
 *
 * `inStock` is `true` if *any* inventory record has `Quantity > 0`, allowing
 * partial stock to be reflected accurately.
 */
@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ProductListItemDto[]> {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
        discounts: true,
        supplier: true,
      },
    });

    return products.map((product) => {
      const firstProduct = product.inventory?.[0];
      return {
        productId: product.Product_ID,
        productName: product.Product_Name,
        imageUrl: product.Image_URL,
        category: {
          categoryId: product.category.Category_ID,
          categoryName: product.category.Category_Name,
        },
        unitPrice: Number(firstProduct?.Unit_Price ?? 0),
        inStock: product.inventory?.some((i) => i.Quantity > 0) ?? false,
      };
    });
  }
}
