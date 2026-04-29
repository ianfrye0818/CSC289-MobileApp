/**
 * Centralised React Query cache keys for the cart feature.
 *
 * Use these keys in `useQuery` / `useMutation` hooks so that cache
 * invalidation after add/remove/update operations always targets the correct
 * entries.
 *
 * @example
 * // Invalidate the cart after adding an item
 * queryClient.invalidateQueries({ queryKey: cartQueryKeys.cart });
 */
export const cartQueryKeys = {
  cart: ['cart'],
  qty: () => [...cartQueryKeys.cart, 'qty'] as const,
};
