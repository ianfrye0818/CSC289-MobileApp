/**
 * Re-exported cart types from the generated OpenAPI schema.
 * Import from here instead of types.generated.ts directly.
 */
import { components } from '@/types/types.generated';

export type ShoppingCart = components['schemas']['ShoppingCartResponseDto'];
export type CartItem = components['schemas']['CartItemDto'];
export type CartItemProduct = components['schemas']['CartItemProductDto'];
export type AddItemToCartRequest = components['schemas']['AddItemToCartRequestDto'];
export type UpdateItemQuantityRequest = components['schemas']['UpdateItemQuantityRequestDto'];