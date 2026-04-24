import { useAuthStore } from '@/features/auth/store';
import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerDetails, UpdateCustomerRequestDto } from '../types';
import { customerQueryKeys } from './shared';

export const useUpdateCurrentCustomer = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: async (payload: {
      original: CustomerDetails;
      modified: UpdateCustomerRequestDto;
    }) =>
      apiClient
        .PATCH('/api/customers/{customerId}', {
          params: { path: { customerId: payload.original.id } },
          body: payload.modified,
        })
        .then(unwrapResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueryKeys.customer });
      appToast.success('Customer updated successfully');
    },
    onError: (error) => {
      appToast.error(error.message);
    },
  });
};
