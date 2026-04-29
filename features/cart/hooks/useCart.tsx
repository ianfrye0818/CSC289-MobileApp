import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Fetches the current user's shopping cart. */
export const useCart = (options?: QueryOptions<ShoppingCart>) => {
  return useQuery({
    queryKey: cartQueryKeys.cart,
    queryFn: async () => await apiClient.GET('/api/cart').then(unwrapResponse),
    ...options,
  });
};
