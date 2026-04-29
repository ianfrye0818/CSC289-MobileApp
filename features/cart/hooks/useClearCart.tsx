import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetCartQtyResponse, ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Clears the entire cart. Invalidates cart cache on success. */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apiClient.DELETE('/api/cart').then(unwrapResponse),
    onMutate: async () => {
      // Stop any in-flight cart/qty fetches so they don't overwrite our optimistic updates.
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.cart });
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.qty() });

      // Get the previous data so we can roll back if needed.
      const prevData = queryClient.getQueryData<ShoppingCart>(cartQueryKeys.cart);
      const prevCartQty = queryClient.getQueryData<GetCartQtyResponse>(cartQueryKeys.qty());

      // Set the updated cart data.
      queryClient.setQueryData(cartQueryKeys.cart, null);
      // Set the updated cart qty data.
      queryClient.setQueryData(cartQueryKeys.qty(), null);
      return { prevData, prevCartQty };
    },
    onError: (error, _, ctx) => {
      if (ctx?.prevData !== undefined) {
        queryClient.setQueryData(cartQueryKeys.cart, ctx.prevData);
      }
      if (ctx?.prevCartQty !== undefined) {
        queryClient.setQueryData(cartQueryKeys.qty(), ctx.prevCartQty);
      }
      appToast.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
        exact: false,
        type: 'all',
      });
      appToast.success('Cart cleared!');
    },
  });
};
