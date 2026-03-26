import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { AddressListReponseDto } from '../types';
import { addressQueryKeys } from './shared';

export const useGetCurrentCustomerAddresses = (
  customerId: number,
  options?: QueryOptions<AddressListReponseDto[]>,
) =>
  useQuery({
    queryKey: addressQueryKeys.lists(),
    queryFn: () =>
      apiClient.GET('/api/addresses', { params: { query: { customerId } } }).then(unwrapResponse),
    ...options,
  });
