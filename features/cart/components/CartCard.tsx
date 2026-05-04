import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useMembershipDiscount } from '@/features/account/hooks/useMembershipDiscount';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { Link } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { CartItem } from '../types';
import { QuantityAdjustor } from './QuantityAdjustor';

interface Props {
  cartItem: CartItem;
  cartId: number;
  itemCount?: number;
  showQuantityAdjustor?: boolean;
}

export function CartCard({ cartItem, itemCount, showQuantityAdjustor = true }: Props) {
  // Apply the member's tier discount to the cart-line preview. The server
  // recalculates this at order-creation time, so the cart number here is
  // a display-only mirror of what the customer will actually be charged.
  const { discountRate, applyDiscount } = useMembershipDiscount();
  const hasDiscount = discountRate > 0;
  const discountedUnitPrice = applyDiscount(cartItem.unitPrice);
  const lineTotal = discountedUnitPrice * cartItem.quantity;
  const formattedPrice = formatCurrency(lineTotal);

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
      <View className='flex-1 min-w-0 justify-evenly items-end p-3 gap-1'>
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
        {cartItem.quantity >= 2 && (
          <View className='flex-row items-baseline gap-2'>
            {hasDiscount && (
              <Text className='text-xs text-muted-foreground line-through'>
                {formatCurrency(cartItem.unitPrice)}
              </Text>
            )}
            <Text
              className={cn(
                'text-sm',
                hasDiscount ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {formatCurrency(discountedUnitPrice)}/unit
            </Text>
          </View>
        )}
        {showQuantityAdjustor && <QuantityAdjustor cartItem={cartItem} />}
        <View className='flex-row items-baseline gap-2'>
          {hasDiscount && (
            <Text className='text-base text-muted-foreground line-through'>
              {formatCurrency(cartItem.unitPrice * cartItem.quantity)}
            </Text>
          )}
          <Text
            className={cn(
              'text-lg',
              hasDiscount ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {formattedPrice}
            {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          </Text>
        </View>
      </View>
    </Card>
  );
}
