import { DiscountType } from '@/types/DiscountType.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from './ProductCategory.dto';

export class ProductInventoryDto {
  @ApiProperty({ type: Number, required: true })
  inventoryId: number;

  @ApiProperty({ type: Number, required: true })
  quantity: number;

  @ApiProperty({ type: Number, required: true })
  unitPrice: number;

  @ApiProperty({ type: Boolean, required: true })
  inStock: boolean; // convenience flag: quantity > 0
}

export class ProductSupplierDto {
  @ApiProperty({ type: Number, required: true })
  supplierId: number;

  @ApiProperty({ type: String, required: true })
  supplierName: string;
}

export class ProductDiscountDto {
  @ApiProperty({ type: Number, required: true })
  discountId: number;

  @ApiProperty({ enum: DiscountType, required: true })
  discountType: DiscountType;

  @ApiProperty({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: Date, required: true })
  startDate: Date;

  @ApiProperty({ type: Date, required: true })
  endDate: Date;
}

export class ProductDetailDto {
  @ApiProperty({ type: Number, required: true })
  productId: number;

  @ApiProperty({ type: String, required: true })
  productName: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  productDescription: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  imageUrl: string | null;

  @ApiProperty({ type: ProductCategoryDto, required: true, nullable: true })
  category: ProductCategoryDto | null;

  @ApiProperty({ type: ProductSupplierDto, required: true })
  supplier: ProductSupplierDto;

  @ApiProperty({ type: [ProductInventoryDto], required: true })
  inventory: ProductInventoryDto[];

  @ApiProperty({ type: [ProductDiscountDto], required: true })
  discounts: ProductDiscountDto[];

  @ApiProperty({ type: Number, required: true })
  lowestPrice: number; // convenience: min Unit_Price across inventory

  @ApiProperty({ type: Boolean, required: true })
  inStock: boolean; // true if any inventory record has quantity > 0
}
