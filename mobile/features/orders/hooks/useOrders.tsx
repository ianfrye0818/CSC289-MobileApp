import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { orderQueryKeys } from './shared';

/** Fetches the current user's order history. */
export const useOrders = () => {
  return useQuery({
    queryKey: orderQueryKeys.orders,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/orders');
      if (error) throw error;
      return data;
    },
  });
};