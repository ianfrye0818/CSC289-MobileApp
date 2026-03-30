import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions, useQuery } from '@tanstack/react-query';
import { AddressResponseDto } from '../types';
import { addressQueryKeys } from './shared';

export const useGetCurrentCustomerAddressById = (
  addressId: number,
  options?: QueryOptions<AddressResponseDto>,
) =>
  useQuery({
    queryKey: addressQueryKeys.details(addressId),
    queryFn: () =>
      apiClient
        .GET('/api/addresses/{addressId}', { params: { path: { addressId } } })
        .then(unwrapResponse),
    enabled: !!addressId,
    ...options,
  });
