import { ValueOf } from '@/types/ValueOf';

export const WebhookEvents = {
  ORDER_CREATED: 'order.created',
  ORDER_CANCELLED: 'order.cancelled',
  SHIPPING_STATUS_UPDATED: 'shipping.status.updated',
  PAYMENT_FAILED: 'payment.failed',
  INVENTORY_OUT_OF_STOCK: 'inventory.out.of.stock',
} as const;

export type WebhookEvents = ValueOf<typeof WebhookEvents>;
