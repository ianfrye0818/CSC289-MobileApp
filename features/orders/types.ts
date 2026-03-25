/**
 * Re-exported order types from the generated OpenAPI schema.
 * Import from here instead of types.generated.ts directly.
 */
import { components } from '@/types/types.generated';

export type OrderListItem = components['schemas']['OrderListResponseDto'];
export type OrderDetails = components['schemas']['OrderDetailsResponseDto'];
export type OrderCustomer = components['schemas']['OrderCustomerDto'];
export type CreateOrderRequest = components['schemas']['CreateOrderCommandDto'];
export type PaymentMethod = CreateOrderRequest['paymentMethod'];