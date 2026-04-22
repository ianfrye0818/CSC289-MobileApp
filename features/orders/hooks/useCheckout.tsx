import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { cartQueryKeys } from '../../cart/hooks/shared';
import { type CreateOrderRequest } from '../types';
import { orderQueryKeys } from './shared';

/**
 * Creates an order from the current cart.
 * Invalidates both orders and cart caches since checkout empties the cart.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) =>
      apiClient.POST('/api/orders', { body: payload }).then(unwrapResponse),
    onError: (error) => {
      appToast.error(error.message);
    },
    onSuccess: async () => {
      appToast.success('Order created successfully');
      await queryClient.invalidateQueries({
        queryKey: orderQueryKeys.orders,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.qty(),
      });
      router.replace('/orders');
    },
  });
};
