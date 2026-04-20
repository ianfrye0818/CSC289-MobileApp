import { Order_Item, } from '@generated/prisma/client';

/**
 * Calculates the grand total for a list of order items.
 *
 * Formula per line: `Amount × Quantity × (1 + Tax)`
 * - `Amount` is the unit price at the time the order was placed (Prisma `Decimal`).
 * - `Tax` is the tax rate stored per item (e.g. `0.0675` for 6.75%).
 * - Multiplying by `(1 + Tax)` adds the tax amount to the item subtotal.
 *
 * @param items - The `Order_Item` records from a Prisma query.
 * @returns The total order amount as a plain JavaScript `number`.
 */
export const calculateOrderAmount = (items: Order_Item[],): number => {
  return items.reduce(
    (acc, item) =>
      //acc + item.Amount.toNumber() * item.Quantity * (1 + item.Tax.toNumber()),
      acc + (item.Amount.toNumber() * item.Quantity) * 1 + item.Tax.toNumber(),
    0,
  );
};
