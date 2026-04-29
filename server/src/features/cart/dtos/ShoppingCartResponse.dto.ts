// dtos/ShoppingCartResponse.dto.ts

import { DiscountType } from '@/types/DiscountType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemInventoryDto {
  @ApiProperty({ type: Number, required: true })
  inventoryId: number;
  @ApiProperty({ type: Number, required: true })
  quantity: number;
  @ApiProperty({ type: Number, required: true })
  unitPrice: number;
}

export class CartItemDiscountDto {
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

export class CartItemProductDto {
  @ApiProperty({ type: Number, required: true })
  productId: number;
  @ApiProperty({ type: String, required: true })
  productName: string;
  @ApiProperty({ type: String, required: false, nullable: true })
  productDescription: string | null;
  @ApiProperty({ type: String, required: false, nullable: true })
  imageUrl: string | null;
  @ApiProperty({ type: String, required: true })
  categoryName: string;
  @ApiProperty({ type: [CartItemDiscountDto], required: true })
  discounts: CartItemDiscountDto[];
}

export class CartItemDto {
  @ApiProperty({ type: Number, required: true })
  inventoryId: number;
  @ApiProperty({ type: Number, required: true })
  quantity: number;
  @ApiProperty({ type: Number, required: true })
  unitPrice: number;
  @ApiProperty({ type: Number, required: true })
  lineTotal: number;
  @ApiProperty({ type: CartItemProductDto, required: true })
  product: CartItemProductDto;
}

export class ShoppingCartResponseDto {
  /** Present when the customer has a cart row; omitted until the first cart is created (e.g. on first add-to-cart). */
  @ApiProperty({ type: Number, required: true })
  cartId: number;
  @ApiProperty({ type: Number, required: true })
  customerId: number;
  @ApiProperty({ type: [CartItemDto], required: true })
  items: CartItemDto[];
  @ApiProperty({ type: Number, required: true })
  subtotal: number;
  @ApiProperty({ type: Number, required: true })
  totalItems: number;
}
