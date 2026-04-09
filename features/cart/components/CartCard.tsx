import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { CartItem } from '../types';

interface Props {
  cartItem: CartItem;
  itemCount?: number;
}

export function CartCard({ cartItem, itemCount }: Props) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  }).format(cartItem.unitPrice);

  return (
    <Link
      href={`/products/${cartItem.product.productId}`}
      push
      asChild
    >
      <Pressable className='flex-1' android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
        {({ pressed }) => (
          <Card className={cn('flex-row gap-0 overflow-hidden items-center py-0', pressed && 'opacity-80')}>
            {/* Image */}
            <Image
              source={{ uri: cartItem.product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL}}
              className='w-40 h-40 bg-muted'
              resizeMode='cover'
            />

            {/* Content */}
            <View className='flex-1 justify-end items-end p-3 gap-5'>
              {/* Name */}
              <Text className='font-semibold text-lg leading-snug' numberOfLines={2}>
                {cartItem.product.productName}
              </Text>

              {/* Quantity adjustor */}
              <View className='flex-row items-center justify-center h-10 rounded-full bg-slate-200 px-3 gap-5'>
                <Pressable className='h-8 w-8 items-center justify-center rounded-full bg-slate-500' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                  <Text className='text-lg font-bold text-white'>-</Text>
                </Pressable>
                <Text>{cartItem.quantity}</Text>
                <Pressable className='h-8 w-8 items-center justify-center rounded-full bg-slate-500' 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
                  <Text className='text-lg font-bold text-white'>+</Text>
                </Pressable>
              </View>
              
              {/* Price */}
              <Text className='text-muted-foreground text-lg'>
                  {formattedPrice}
                  {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              </Text>
            </View>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}