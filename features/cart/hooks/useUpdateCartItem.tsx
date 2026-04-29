import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItem, ShoppingCart, type UpdateItemQuantityRequest } from '../types';
import { cartQueryKeys } from './shared';

/** Updates the quantity of an item in the cart. Invalidates cart cache on success. */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { original: CartItem; dto: UpdateItemQuantityRequest }) => {
      const { data, error } = await apiClient.PATCH('/api/cart/item', {
        body: payload.dto,
      });
      if (error) throw error;
      return data;
    },
    onMutate: async (payload) => {
      // Stop any in-flight cart fetches so they don't overwrite our optimistic updates.
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.cart });
      // Get the previous data so we can roll back if needed.
      const prevData = queryClient.getQueryData<ShoppingCart>(cartQueryKeys.cart);
      // If there's no previous data, we can't do anything.
      if (!prevData) return { prevData: null };

      // Update the cart data so it reflects the update.
      const updatedData = {
        ...prevData,
        items: prevData.items.map((i) =>
          i.inventoryId === payload.dto.inventoryId ? { ...i, quantity: payload.dto.quantity } : i,
        ),
      };

      // Set the updated cart data.
      queryClient.setQueryData(cartQueryKeys.cart, updatedData);

      // Return the previous data so we can roll back if needed.
      return { prevData };
    },
    onError: (error, _, ctx) => {
      if (ctx?.prevData) {
        // Roll back the cart data so UI returns to the last known-good state.
        queryClient.setQueryData(cartQueryKeys.cart, ctx.prevData);
      }
      appToast.error(error.message);
    },
  });
};
