import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetCartQtyResponse, RemoveItemFromCartRequest, ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Removes a single item from the cart by product ID. Invalidates cart cache on success. */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { dto: RemoveItemFromCartRequest }) => {
      const { data, error } = await apiClient.DELETE('/api/cart/item', {
        body: payload.dto,
      });
      if (error) throw error;
      return data;
    },
    onMutate: async (payload) => {
      // Stop any in-flight cart/qty fetches so they don't overwrite our optimistic updates.
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.cart });
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.qty() });

      // Get the previous data so we can roll back if needed.
      const prevData = queryClient.getQueryData<ShoppingCart>(cartQueryKeys.cart);
      const prevCartQty = queryClient.getQueryData<GetCartQtyResponse>(cartQueryKeys.qty());

      // If there's no previous data, we can't do anything.
      if (!prevData) return { prevData: null, prevCartQty: prevCartQty ?? null };

      // The badge qty comes from `/api/cart/qty`, which is `count(cart.items)` on the server.
      // Since we're deleting a single line item (by inventoryId), the badge should decrement
      // by 1 if (and only if) that line existed in the cached cart.
      const removedItem = prevData.items.find((i) => i.inventoryId === payload.dto.inventoryId);

      // Update the cart data so it reflects the removal.
      const updatedData = {
        ...prevData,
        items: prevData.items.filter((i) => i.inventoryId !== payload.dto.inventoryId),
      };

      // Set the updated cart data.
      queryClient.setQueryData(cartQueryKeys.cart, updatedData);

      // Decrement the badge qty by 1 if the line item existed in the cached cart.
      if (prevCartQty && removedItem) {
        queryClient.setQueryData<GetCartQtyResponse>(cartQueryKeys.qty(), {
          ...prevCartQty,
          qty: Math.max(0, prevCartQty.qty - 1),
        });
      }

      return { prevData, prevCartQty: prevCartQty ?? null };
    },
    onError: (error, _, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(cartQueryKeys.cart, ctx.prevData);
      }
      if (ctx?.prevCartQty) {
        // Roll back the badge too so UI returns to the last known-good state.
        queryClient.setQueryData(cartQueryKeys.qty(), ctx.prevCartQty);
      }
      appToast.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.qty(),
      });
      appToast.success('Item removed from cart!');
    },
  });
};
