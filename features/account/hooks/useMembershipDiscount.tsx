import { useGetCustomer } from './useGetCustomer';

/**
 * Returns the current customer's membership discount rate as a 0–100
 * percentage (e.g. `10` == 10% off). Falls back to `0` while the customer
 * profile is still loading or if the request errors, so callers can apply
 * the rate unconditionally without a flicker of "unfetched" UI.
 *
 * Also exposes a `applyDiscount(price)` helper for the common case of
 * computing the displayed price for a single unit.
 */
export function useMembershipDiscount() {
  const { data, isLoading, error } = useGetCustomer();
  // Treat any non-positive or missing value as 0% — keeps math safe even if
  // the server ever returns a negative or null discount rate by mistake.
  const rawRate = data?.memberDetails?.discountRate ?? 0;
  const discountRate = rawRate > 0 ? rawRate : 0;

  const applyDiscount = (price: number) =>
    price - (price * discountRate) / 100;

  return { discountRate, applyDiscount, isLoading, error };
}
