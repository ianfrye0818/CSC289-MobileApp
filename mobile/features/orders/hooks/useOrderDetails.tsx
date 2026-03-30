import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { orderQueryKeys } from './shared';

/**
 * Fetches detailed information for a single order.
 * Query is disabled until a valid orderId is provided.
 * Each order is cached independently by its ID.
 */
export const useOrderDetails = (orderId: number) => {
  return useQuery({
    queryKey: orderQueryKeys.orderDetails(orderId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/orders/{orderId}', {
        params: { path: { orderId: orderId! } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
};
