import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductListItemDto } from '../../dtos/ProductListItem.dto';
import { GetSuggestedProductsQuery } from './GetSuggestedProductsQuery';

interface RawSuggestedProduct {
  Product_ID: number;
  Product_Name: string;
  Product_Description: string | null;
  Category_ID: number;
  Category_Name: string;
  Supplier_ID: number;
  Image_URL: string | null;
  Deleted_At: Date | null;
  Purchase_Count: number;
  Sort_Priority: number;
  Quantity: number;
  Unit_Price: number | string;
}

@QueryHandler(GetSuggestedProductsQuery)
export class GetSuggestedProductsQueryHandler implements IQueryHandler<GetSuggestedProductsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetSuggestedProductsQuery,
  ): Promise<ProductListItemDto[]> {
    const { productId } = query;

    const currentProduct = await this.prisma.product.findUnique({
      where: { Product_ID: productId },
      select: { Category_ID: true },
    });

    const suggestedProducts = await this.prisma.$queryRaw<
      RawSuggestedProduct[]
    >`
      SELECT * FROM (
        -- First: same category products ranked by purchase count
        SELECT 
          p.*,
          i.Quantity,
          i.Unit_Price,
          c.Category_Name,
          COUNT(oi.Order_ID) as Purchase_Count,
          0 as Sort_Priority  -- lower = shown first
        FROM Order_Item oi
        JOIN Inventory i ON oi.Inventory_ID = i.Inventory_ID
        JOIN Product p ON i.Product_ID = p.Product_ID
        JOIN Product_Category c on c.Category_ID = p.Category_ID
        WHERE 
          p.Category_ID = ${currentProduct?.Category_ID}
          AND p.Product_ID != ${productId}
        GROUP BY p.Product_ID, i.Quantity, i.Unit_Price, c.Category_Name

        UNION ALL

        -- Fallback: top products from any other category
        SELECT 
          p.*,
          i.Quantity,
          i.Unit_Price,
          c.Category_Name,
          COUNT(oi.Order_ID) as Purchase_Count,
          1 as Sort_Priority
        FROM Order_Item oi
        JOIN Inventory i ON oi.Inventory_ID = i.Inventory_ID
        JOIN Product p ON i.Product_ID = p.Product_ID
        JOIN Product_Category c on c.Category_ID = p.Category_ID
        WHERE 
          p.Category_ID != ${currentProduct?.Category_ID}
          AND p.Product_ID != ${productId}
        GROUP BY p.Product_ID, i.Quantity, i.Unit_Price, c.Category_Name
      ) as Combined
      ORDER BY Sort_Priority ASC, Purchase_Count DESC
      LIMIT 5
   `;

    return suggestedProducts.map((product) => ({
      productId: product.Product_ID,
      productName: product.Product_Name,
      productDescription: product.Product_Description,
      category: {
        categoryId: product.Category_ID,
        categoryName: product.Category_Name,
      },
      supplier: product.Supplier_ID,
      imageUrl: product.Image_URL,
      deletedAt: product.Deleted_At,
      inStock: product.Quantity > 0,
      unitPrice: Number(product.Unit_Price),
    }));
  }
}
