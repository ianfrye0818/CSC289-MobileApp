import { ValueOf } from '@/types/ValueOf';

export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  GOOGLE_PAY: 'GOOGLE_PAY',
  APPLE_PAY: 'APPLE_PAY',
} as const;

export type PaymentMethod = ValueOf<typeof PaymentMethod>;
