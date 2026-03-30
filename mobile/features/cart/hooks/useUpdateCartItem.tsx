import { apiClient } from '@/lib/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type UpdateItemQuantityRequest } from '../types';
import { cartQueryKeys } from './shared';

/** Updates the quantity of an item in the cart. Invalidates cart cache on success. */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateItemQuantityRequest) => {
      const { data, error } = await apiClient.PATCH('/api/cart/items/{productId}', {
        body: payload,
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