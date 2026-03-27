import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { AddressResponseDto } from '../types';
import { addressQueryKeys } from './shared';

export const useGetCurrentCustomerAddresses = (options?: QueryOptions<AddressResponseDto[]>) =>
  useQuery({
    queryKey: addressQueryKeys.lists(),
    queryFn: () => apiClient.GET('/api/addresses').then(unwrapResponse),
    ...options,
  });
