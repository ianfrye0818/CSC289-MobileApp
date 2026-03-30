import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { CustomerDetails } from '../types';
import { customerQueryKeys } from './shared';

/** Fetches the current authenticated user's customer profile. */
export const useGetCustomer = (options?: QueryOptions<CustomerDetails>) => {
  return useQuery({
    queryKey: customerQueryKeys.customer,
    queryFn: () => apiClient.GET('/api/customers/{customerId}', { params: { path: { customerId: 1003 } } }).then(unwrapResponse),
    ...options,
  });
};
