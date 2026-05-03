import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { cartQueryKeys } from '../../cart/hooks/shared';
import { orderQueryKeys } from '../../orders/hooks/shared';
import { type CreateOrderRequest } from '../../orders/types';

/**
 * Creates an order from the current cart.
 * Invalidates both orders and cart caches since checkout empties the cart.
 */
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      const { data, error } = await apiClient.POST('/api/orders', {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: orderQueryKeys.orders,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
      appToast.success('Order created successfully');
      const orderId = data?.data?.id;
      if (orderId) {
        router.push(`/orders/${orderId}`);
      } else {
        router.push('/orders');
      }
    },
  });
};
