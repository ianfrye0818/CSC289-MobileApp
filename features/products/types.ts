/**
 * Re-exported product types from the generated OpenAPI schema.
 * Import from here instead of types.generated.ts directly.
 */

import { components } from '@/types/types.generated';

export type ProductListItem = components['schemas']['ProductListItemDto'];
export type ProductDetail = components['schemas']['ProductDetailDto'];
export type ProductCategory = components['schemas']['ProductCategoryDto'];
export type ProductSupplier = components['schemas']['ProductSupplierDto'];
export type ProductInventory = components['schemas']['ProductInventoryDto'];
export type ProductDiscount = components['schemas']['ProductDiscountDto'];