import { ProductDetail } from '@/features/products/types';
import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetCartQtyResponse, ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Adds a product to the current user's cart. Invalidates cart cache on success. */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { product: ProductDetail; quantity: number }) => {
      const { data, error } = await apiClient.POST('/api/cart/add', {
        body: {
          productId: payload.product.productId,
          quantity: payload.quantity,
        },
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

      // Check if the product is already in the cart.
      const alreadyInCart = prevData.items.some(
        (i) => i.product.productId === payload.product.productId,
      );

      // Update the cart data so it reflects the addition.
      const updatedData = {
        ...prevData,
        items: [
          ...prevData.items.filter((i) => i.product.productId !== payload.product.productId),
          ...payload.product.inventory.map((i) => ({
            inventoryId: i.inventoryId,
            quantity: payload.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.unitPrice * payload.quantity,
            product: payload.product,
          })),
        ],
      };

      // Set the updated cart data.
      queryClient.setQueryData(cartQueryKeys.cart, updatedData);

      // Increment the badge qty by 1 if the product was not already in the cart.
      if (prevCartQty && !alreadyInCart) {
        queryClient.setQueryData<GetCartQtyResponse>(cartQueryKeys.qty(), {
          ...prevCartQty,
          qty: prevCartQty.qty + 1,
        });
      }

      // Return the previous data so we can roll back if needed.
      return { prevData, prevCartQty: prevCartQty ?? null };
    },

    onError: (error, _, ctx) => {
      if (ctx?.prevData) {
        // Roll back the cart data so UI returns to the last known-good state.
        queryClient.setQueryData(cartQueryKeys.cart, ctx.prevData);
      }
      if (ctx?.prevCartQty) {
        // Roll back the badge qty so UI returns to the last known-good state.
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
    },
  });
};
