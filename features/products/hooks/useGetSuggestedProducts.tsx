import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { ProductListItem } from '../types';
import { productQueryKeys } from './shared';

export const useGetSuggestedProducts = (
  productId: number,
  options?: QueryOptions<ProductListItem[]>,
) =>
  useQuery({
    queryKey: productQueryKeys.suggested(productId),
    queryFn: async () =>
      apiClient
        .GET(`/api/products/{productId}/suggested`, { params: { path: { productId } } })
        .then(unwrapResponse),
    ...options,
  });
