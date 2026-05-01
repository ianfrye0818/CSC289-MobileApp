import { ValueOf } from '@/types/ValueOf';

export const ShippingStatus = {
  PENDING: 'PENDING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
} as const;

export type ShippingStatus = ValueOf<typeof ShippingStatus>;
