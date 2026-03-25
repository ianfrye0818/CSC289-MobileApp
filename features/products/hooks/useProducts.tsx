import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { productQueryKeys } from './shared';

/** Fetches all available products from the catalogue. */
export const useProducts = () => {
  return useQuery({
    queryKey: productQueryKeys.products,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/products');
      if (error) throw error;
      return data;
    },
  });
};