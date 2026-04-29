import { ValueOf } from './ValueOf';

export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  GOOGLE_PAY: 'GOOGLE_PAY',
  APPLE_PAY: 'APPLE_PAY',
  PAYPAL: 'PAYPAL',
} as const;

export type PaymentMethod = ValueOf<typeof PaymentMethod>;

export function getPaymentLabel(paymentMethod: string) {
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
