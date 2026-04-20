import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Empty cart when the API returns 404 (older servers) or before a cart row exists. */
function emptyCartPlaceholder(): ShoppingCart {
  return {
    cartId: null,
    customerId: 0,
    items: [],
    subtotal: 0,
    totalItems: 0,
  };
}

/** Fetches the current user's shopping cart. */
export const useCart = (options?: QueryOptions<ShoppingCart>) => {
  return useQuery({
    queryKey: cartQueryKeys.cart,
    queryFn: async () => {
      const response = await apiClient.GET('/api/cart');
      if (response.response?.status === 404) {
        return emptyCartPlaceholder();
      }
      return unwrapResponse(response);
    },
  });
};
