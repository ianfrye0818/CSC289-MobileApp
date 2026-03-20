/**
 * Centralised React Query cache keys for the orders feature.
 *
 * Use these keys in `useQuery` / `useMutation` hooks so that cache
 * invalidation after checkout or status changes always targets the correct
 * entries.
 *
 * @example
 * // Invalidate all orders after checkout
 * queryClient.invalidateQueries({ queryKey: orderQueryKeys.orders });
 */
export const orderQueryKeys = {
  /** Base key for the current user's order list. */
  orders: ['orders'],
  /**
   * Key for a single order's detail query.
   * Inherits `orders` as a prefix so invalidating the list also clears
   * individual detail caches.
   */
  orderDetails: (orderId: number) => [...orderQueryKeys.orders, orderId],
};
