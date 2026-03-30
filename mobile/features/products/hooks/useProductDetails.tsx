import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { ProductDetail } from '../types';
import { productQueryKeys } from './shared';

/**
 * Fetches detailed product information by ID.
 * Query is disabled until a valid productId is provided.
 * Each product is cached independently by its ID.
 */
export const useProductDetails = (productId: number, options?: QueryOptions<ProductDetail>) => {
  return useQuery({
    queryKey: productQueryKeys.details(productId),
    queryFn: async () =>
      apiClient
        .GET('/api/products/{productId}', { params: { path: { productId } } })
        .then(unwrapResponse),
    enabled: !!productId,
    ...options,
  });
};
