import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { cartQueryKeys } from './shared';

/** Fetches the current user's shopping cart. */
export const useCart = () => {
  return useQuery({
    queryKey: cartQueryKeys.cart,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/cart');
      if (error) throw error;
      return data;
    },
  });
};