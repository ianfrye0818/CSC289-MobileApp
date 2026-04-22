import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { Alert, Image, Pressable, View } from 'react-native';
import { CartItem } from '../types';
import { useRemoveCartItem } from '../hooks/useRemoveCartItem';
import { QuantityAdjustor } from './QuantityAdjustor';

interface Props {
  cartItem: CartItem;
  cartId: number;
  itemCount?: number;
}

export function CartCard({ cartItem, cartId, itemCount }: Props) {
  const lineTotal = cartItem.unitPrice * cartItem.quantity;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(lineTotal);

  const { mutate: removeItem, isPending } = useRemoveCartItem();

  const handleDelete = () => {
    Alert.alert(
      'Remove Item',
      `Remove "${cartItem.product.productName}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () =>
            removeItem({ cartId, dto: { inventoryId: cartItem.inventoryId, quantity: cartItem.quantity } }),
        },
      ],
    );
  };

  return (
    <Card className='flex-row gap-0 overflow-hidden items-stretch py-0'>
      <Link
        href={`/products/${cartItem.product.productId}`}
        push
        asChild
      >
        <Pressable
          className='shrink-0'
          android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
        >
          {({ pressed }) => (
            <Image
              source={{ uri: cartItem.product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL }}
              className={cn('w-40 h-40 bg-muted', pressed && 'opacity-80')}
              resizeMode='cover'
            />
          )}
        </Pressable>
      </Link>
      <View className='flex-1 min-w-0 p-3 gap-2'>
        <View className='flex-row items-start justify-between gap-2'>
          <Link
            href={`/products/${cartItem.product.productId}`}
            push
            asChild
          >
            <Pressable
              className='flex-1 active:opacity-80'
              android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
            >
              <Text
                className='font-semibold text-base leading-snug'
                numberOfLines={2}
              >
                {cartItem.product.productName}
              </Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className='p-1 rounded-md active:opacity-60'
            android_ripple={{ color: 'rgba(239,68,68,0.15)', radius: 16 }}
            hitSlop={8}
          >
            <Trash2
              size={18}
              className={cn('text-muted-foreground', isPending && 'opacity-40')}
            />
          </Pressable>
        </View>
        <View className='flex-1 justify-end items-end gap-3'>
          <QuantityAdjustor
            cartItem={cartItem}
            cartId={cartId}
          />
          <Text className='text-muted-foreground text-base'>
            {formattedPrice}
            {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          </Text>
        </View>
      </View>
    </Card>
  );
}
