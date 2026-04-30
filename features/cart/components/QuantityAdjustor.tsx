import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { useRemoveCartItem } from '@/features/cart/hooks/useRemoveCartItem';
import { useUpdateCartItem } from '@/features/cart/hooks/useUpdateCartItem';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { appToast } from '@/lib/toast';
import { Alert, Pressable, View } from 'react-native';
import { CartItem } from '../types';

interface Props {
  cartItem: CartItem;
}

export function QuantityAdjustor({ cartItem }: Props) {
  const { data: product } = useProductDetails(cartItem.product.productId);
  const { mutate: updateCartItems } = useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemovingCartItem } = useRemoveCartItem();

  const editQuantity = (delta: number) => {
    if (!product) return; // Product not loaded yet
    const inventory = product.inventory.find((inv) => inv.inventoryId === cartItem.inventoryId);

    if (!inventory) {
      appToast.error('Inventory not found for cart item');
      return;
    }

    const stock = inventory.quantity;
    const newQuantity = Math.max(0, Math.min(cartItem.quantity + delta, stock));

    if (newQuantity === 0) {
      removeCartItem({
        dto: { inventoryId: cartItem.inventoryId },
      });
    } else {
      updateCartItems({
        original: cartItem,
        dto: { inventoryId: cartItem.inventoryId, quantity: newQuantity },
      });
    }
  };

  const confirmRemove = () => {
    Alert.alert('Remove Item', `Are you sure you want to remove ${cartItem.product.productName}?`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeCartItem({
            dto: { inventoryId: cartItem.inventoryId },
          });
        },
      },
    ]);
  };

  return (
    <View className='flex-row items-center justify-center h-10 px-3 gap-2'>
      <Pressable
        className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
        onPress={() => confirmRemove()}
        disabled={isRemovingCartItem}
      >
        <IconSymbol
          size={16}
          name='trash'
          color='white'
        />
      </Pressable>

      <View className='flex-row items-center justify-center h-10 rounded-full bg-slate-200 px-3 gap-5'>
        <Pressable
          className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          onPress={() => editQuantity(-1)}
        >
          <IconSymbol
            size={16}
            name='minus'
            color='white'
          />
        </Pressable>
        <Text>{cartItem.quantity}</Text>
        <Pressable
          className='h-8 w-8 items-center justify-center rounded-full bg-slate-500'
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          onPress={() => editQuantity(1)}
        >
          <IconSymbol
            size={16}
            name='plus'
            color='white'
          />
        </Pressable>
      </View>
    </View>
  );
}
