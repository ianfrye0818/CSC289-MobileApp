import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddAddressRequestDto } from '../types';
import { addressQueryKeys } from './shared';

export const useAddAddressToCurrentCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AddAddressRequestDto) =>
      apiClient.POST('/api/addresses', { body: dto }).then(unwrapResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.lists() });
      appToast.success('Address added successfully');
    },
    onError: (error) => {
      appToast.error(error.message);
    },
  });
};
