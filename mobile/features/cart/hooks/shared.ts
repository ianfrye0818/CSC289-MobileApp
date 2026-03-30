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
  /** Base key for the current user's cart. */
  cart: ['cart'],
  /**
   * Key for the items within a specific cart.
   * Inherits `cart` as a prefix so invalidating the base key cascades.
   */
  cartItems: (cartId: number) => [...cartQueryKeys.cart, cartId],
};
