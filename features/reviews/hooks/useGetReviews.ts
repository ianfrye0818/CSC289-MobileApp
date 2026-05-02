import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { Review } from '../types';

export const useGetReviews = (productId: number, limit: number, options?: QueryOptions<Review[]>) =>
  useQuery({
    queryKey: ['reviews', productId, limit],
    queryFn: () =>
      apiClient.GET('/api/reviews/random', { params: { query: { limit } } }).then(unwrapResponse),
    ...options,
  });
