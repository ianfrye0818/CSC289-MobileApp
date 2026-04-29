import * as DBox from '@/components/ui/dialog';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { useRemoveCartItem } from '@/features/cart/hooks/useRemoveCartItem';
import { useUpdateCartItem } from '@/features/cart/hooks/useUpdateCartItem';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CartItem } from '../types';

interface Props {
  cartItem: CartItem;
  cartId?: number;
}

export function QuantityAdjustor({ cartItem, cartId }: Props) {
  const { data: product } = useProductDetails(cartItem.product.productId);
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();

  const [dialogOpen, setDialogOpen] = useState(false);

  const editQuantity = (delta: number) => {
    if (!product) return; // Product not loaded yet
    if (cartId == null) {
      console.error('Missing cartId for quantity update');
      return;
    }

    const inventory = product.inventory.find((inv) => inv.inventoryId === cartItem.inventoryId);
    if (!inventory) {
      console.error('Inventory not found for cart item');
      return;
    }

    const stock = inventory.quantity;
    const newQuantity = Math.max(0, Math.min(cartItem.quantity + delta, stock));

    if (newQuantity === 0) {
      // Remove item from cart
      setDialogOpen(true);
    } else {
      // Update quantity
      updateCartItem.mutate({
        cartId,
        original: cartItem,
        dto: { inventoryId: cartItem.inventoryId, quantity: newQuantity },
      });
    }
  };

  const confirmRemove = () => {

    if (cartId == null) {
    console.error('Missing cartId for removal');
    return;
    }

    removeCartItem.mutate({
      cartId,
      dto: {inventoryId: cartItem.inventoryId, quantity: cartItem.quantity,
      },
    });

    setDialogOpen(false);
  };

  return (
    <>
      {/* Dialog */}
      <DBox.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DBox.DialogContent>
          <DBox.DialogHeader>
            <DBox.DialogTitle>Remove Item?</DBox.DialogTitle>
          </DBox.DialogHeader>

          <Text>This item will be removed from your cart.</Text>

          <DBox.DialogFooter>
            <DBox.DialogClose asChild>
              <Pressable
                className="px-4 py-2 rounded bg-slate-200"
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              >
                <Text>Cancel</Text>
              </Pressable>
            </DBox.DialogClose>

            <Pressable
              className="px-4 py-2 rounded bg-red-500"
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
              onPress={confirmRemove}
            >
              <Text className="text-white">Remove</Text>
            </Pressable>
          </DBox.DialogFooter>
        </DBox.DialogContent>
      </DBox.Dialog>
    
      <View
        className='flex-row items-center justify-center h-10 px-3 gap-5'
      >
        <Pressable
          className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          onPress={() => setDialogOpen(true)}
        >
          <IconSymbol size={16} name='trash' color='white' />
        </Pressable>

        <View className='flex-row items-center justify-center h-10 rounded-full bg-slate-200 px-3 gap-5'>
          <Pressable
            className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            onPress={() => editQuantity(-1)}
          >
            <IconSymbol size={16} name='minus' color='white' />
          </Pressable>
          <Text>{cartItem.quantity}</Text>
          <Pressable
            className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            onPress={() => editQuantity(1)}
          >
            <IconSymbol size={16} name='plus' color='white' />
          </Pressable>
        </View>
      </View>
    </>
  );
}
