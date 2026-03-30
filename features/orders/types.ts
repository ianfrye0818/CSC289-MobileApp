/**
 * Re-exported order types from the generated OpenAPI schema.
 * Import from here instead of types.generated.ts directly.
 */
import { components } from "@/types/types.generated";

export type OrderListItem = components["schemas"]["OrderListResponseDto"];
export type OrderCustomer = components["schemas"]["OrderCustomerDto"];
export type CreateOrderRequest = components["schemas"]["CreateOrderCommandDto"];
export type PaymentMethod = CreateOrderRequest["paymentMethod"];

/* ── Sub-types used by the Order Detail screen ── */

export type OrderAddress = components["schemas"]["OrderDetailsResponseAddress"];
export type OrderPayment = components["schemas"]["OrderDetailsResponsePayment"];
export type OrderShipping =
  components["schemas"]["OrderDetailsResponseShippingDetails"];
export type OrderDiscount =
  components["schemas"]["OrderDetailsResponseDiscount"];

/**
 * The generated OrderDetailsResponseDto has `items` typed as
 * OrderDetailsResponseAddress due to a mismatched @ApiProperty decorator
 * in the backend DTO (the runtime data is correct).
 *
 * This interface overrides `items` and `discounts` with the shapes the
 * server actually returns. Once the backend decorator is fixed and the
 * schema is regenerated, this can be replaced with a direct re-export.
 */
export interface OrderDetails {
  id: number;
  customer: OrderCustomer;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  items: OrderItem[];
  payment: OrderPayment;
  shipping: OrderShipping | null;
  discounts: OrderDiscount[];
  orderDate: string;
  totalAmount: number;
}

/**
 * Single line item in an order. Matches OrderDetailsResponseItem
 * from the backend DTO (which the generated schema gets wrong).
 */
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  tax: number | null;
}
