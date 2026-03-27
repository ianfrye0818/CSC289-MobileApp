import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { ProductListItem } from '../types';
import { productQueryKeys } from './shared';

/** Fetches all available products from the catalogue. */
export const useProducts = (options?: QueryOptions<ProductListItem[]>) => {
  return useQuery({
    queryKey: productQueryKeys.products,
    queryFn: async () => apiClient.GET('/api/products').then(unwrapResponse),
    ...options,
  });
};
