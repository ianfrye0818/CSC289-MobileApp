import { apiClient } from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { customerQueryKeys } from './shared';

/** Fetches the current authenticated user's customer profile. */
export const useGetCustomer = () => {
  return useQuery({
    queryKey: customerQueryKeys.customer,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/customers/me');
      if (error) throw error;
      return data;
    },
  });
};
