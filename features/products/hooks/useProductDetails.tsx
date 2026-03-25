import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { productQueryKeys } from './shared';

/**
 * Fetches detailed product information by ID.
 * Query is disabled until a valid productId is provided.
 * Each product is cached independently by its ID.
 */
export const useProductDetails = (productId: number | undefined) => {
  return useQuery({
    queryKey: productQueryKeys.productDetails(productId!),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/products/{productId}', {
        params: { path: { productId: productId! } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
};