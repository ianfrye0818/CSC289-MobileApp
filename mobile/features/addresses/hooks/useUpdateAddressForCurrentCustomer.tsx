import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressResponseDto, UpdateAddressRequestDto } from '../types';
import { addressQueryKeys } from './shared';

export const useUpdateAddressForCurrentCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      original: AddressResponseDto;
      modified: UpdateAddressRequestDto;
    }) =>
      apiClient
        .PATCH('/api/addresses/{addressId}', {
          params: { path: { addressId: payload.original.id } },
          body: payload.modified,
        })
        .then(unwrapResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.lists() });
      appToast.success('Address updated successfully');
    },
    onError: (error) => {
      appToast.error(error.message);
    },
  });
};
