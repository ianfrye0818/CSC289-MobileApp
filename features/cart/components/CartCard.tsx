import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { CartItem } from '../types';
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
      <View className='flex-1 min-w-0 justify-end items-end p-3 gap-5'>
        <Link
          href={`/products/${cartItem.product.productId}`}
          push
          asChild
        >
          <Pressable
            className='w-full active:opacity-80'
            android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
          >
            <Text
              className='font-semibold text-lg leading-snug text-right'
              numberOfLines={2}
            >
              {cartItem.product.productName}
            </Text>
          </Pressable>
        </Link>
        <QuantityAdjustor
          cartItem={cartItem}
          cartId={cartId}
        />
        <Text className='text-muted-foreground text-lg'>
          {formattedPrice}
          {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        </Text>
      </View>
    </Card>
  );
}
