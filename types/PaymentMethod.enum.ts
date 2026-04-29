import { ValueOf } from './ValueOf';

export const PaymentMethod = {
  APPLE_PAY: 'APPLE_PAY',
  GOOGLE_PAY: 'GOOGLE_PAY',
  PAYPAL: 'PAYPAL',
  CREDIT_CARD: 'CREDIT_CARD',
} as const;

export type PaymentMethod = ValueOf<typeof PaymentMethod>;

export function getPaymentLabel(paymentMethod?: string) {
  if (!paymentMethod) return 'Unknown';
  switch (paymentMethod) {
    case PaymentMethod.APPLE_PAY:
      return 'Apple Pay';
    case PaymentMethod.GOOGLE_PAY:
      return 'Google Pay';
    case PaymentMethod.CREDIT_CARD:
      return 'Credit Card';
    case PaymentMethod.PAYPAL:
      return 'PayPal';
    default:
      return 'Unknown';
  }
}
