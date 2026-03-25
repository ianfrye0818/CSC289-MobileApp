/**
 * Centralised React Query cache keys for the products feature.
 *
 * Keeping all keys in one place means:
 * - Invalidating `products` (e.g. after creating a product) automatically
 *   invalidates all queries that depend on the product list.
 * - There is a single source of truth — no copy-pasted string literals that
 *   could get out of sync across hooks.
 *
 * @example
 * // Invalidate the whole product list after a mutation
 * queryClient.invalidateQueries({ queryKey: productQueryKeys.products });
 *
 * // Invalidate a single product's detail cache
 * queryClient.invalidateQueries({ queryKey: productQueryKeys.productDetails(42) });
 */
export const productQueryKeys = {
  /** Base key for all product list queries. */
  products: ['products'],
  /**
   * Key for a single product's detail query.
   * Inherits `products` as a prefix so invalidating all products also
   * invalidates individual detail caches.
   */
  productDetails: (productId: number) => [...productQueryKeys.products, productId],
};