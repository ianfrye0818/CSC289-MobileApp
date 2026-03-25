import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { customerQueryKeys } from './shared';

/** Fetches the current authenticated user's customer profile. */
export const useGetCustomer = () => {
  return useQuery({
    queryKey: customerQueryKeys.customer,
    queryFn: async () => {
      await apiClient.GET('/api/customers/me');
    },
  });
};
