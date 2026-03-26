import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressListReponseDto } from '../types';
import { addressQueryKeys } from './shared';

export const useDeleteAddressForCurrentCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AddressListReponseDto) =>
      apiClient
        .DELETE('/api/addresses/{addressId}', {
          params: { path: { addressId: dto.id } },
        })
        .then(unwrapResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.lists() });
      appToast.success('Address deleted successfully');
    },
    onError: (error) => {
      appToast.error(error.message);
    },
  });
};
