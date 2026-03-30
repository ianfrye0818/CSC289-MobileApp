import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartQueryKeys } from '../../cart/hooks/shared';
import { type CreateOrderRequest } from '../types';
import { orderQueryKeys } from './shared';

/**
 * Creates an order from the current cart.
 * Invalidates both orders and cart caches since checkout empties the cart.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      const { data, error } = await apiClient.POST('/api/orders', {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orderQueryKeys.orders,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};