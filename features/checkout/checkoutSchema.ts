import { PaymentMethod } from '@/types/PaymentMethod.enum';
import z from 'zod';

/** Expiry must be strictly after “now” (year > this year, or same year with month ≥ current month). */
export const creditCardSchema = z
  .object({
    cardNumber: z
      .string()
      .length(16, 'Card number must be 16 digits')
      .regex(/^\d{16}$/, 'Card number must be 16 digits'),
    expiryMonth: z.coerce
      .number()
      .int()
      .min(1, 'Month must be between 1 and 12')
      .max(12, 'Month must be between 1 and 12'),
    expiryYear: z.coerce
      .number()
      .int()
      .min(2000, 'Enter a valid 4-digit year')
      .max(2100, 'Enter a valid 4-digit year'),
    cvc: z
      .union([z.string(), z.number()])
      .transform((val) =>
        typeof val === 'number' ? String(Math.trunc(val)).padStart(3, '0') : val.trim(),
      )
      .pipe(z.string().regex(/^\d{3}$/, 'CVC must be 3 digits (000–999)')),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (data.expiryYear < currentYear) {
      ctx.addIssue({
        code: 'custom',
        message: 'Expiry year must be this year or later',
        path: ['expiryYear'],
      });
      return;
    }

    if (data.expiryYear === currentYear && data.expiryMonth < currentMonth) {
      ctx.addIssue({
        code: 'custom',
        message: 'Expiry must be in the future',
        path: ['expiryMonth'],
      });
    }
  });

export const checkoutSchema = z
  .object({
    cartId: z.coerce.number(),
    addressId: z.number().optional(),
    creditCard: creditCardSchema.optional(),
    paymentMethod: z.enum(PaymentMethod),
    shippingCost: z.number().nonnegative(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== PaymentMethod.CREDIT_CARD) return;
    const parsed = creditCardSchema.safeParse(data.creditCard);
    if (parsed.success) return;
    for (const issue of parsed.error.issues) {
      ctx.addIssue({
        ...issue,
        path: ['creditCard', ...issue.path],
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
