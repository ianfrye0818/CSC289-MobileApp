/**
 * The two ways a discount can be applied to a product or order.
 *
 * - `PERCENTAGE` — reduce the price by a percentage (e.g. 10% off).
 * - `FLAT` — reduce the price by a fixed dollar amount (e.g. $5 off).
 *
 * String values match what is stored in the database `Discount_Type` column.
 * Using `as const` keeps TypeScript's type system narrow (string literal union)
 * rather than widening to `string`.
 */
export const DiscountType = {
  PERCENTAGE: 'Percentage',
  FLAT: 'Flat',
} as const;

/** Union type of all valid discount type string values. */
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];
