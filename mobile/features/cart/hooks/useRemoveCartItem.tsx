import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartQueryKeys } from './shared';

/** Removes a single item from the cart by product ID. Invalidates cart cache on success. */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const { data, error } = await apiClient.DELETE('/api/cart/items/{productId}', {
        params: { path: { productId } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};