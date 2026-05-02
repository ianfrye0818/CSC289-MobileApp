import { ValueOf } from '@/types/ValueOf';

export const ShippingStatus = {
  PENDING: 'Pending',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
} as const;

export type ShippingStatus = ValueOf<typeof ShippingStatus>;
