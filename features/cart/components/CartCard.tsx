import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
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
  const { data: customer } = useGetCustomer();
  const discountRate = customer?.memberDetails?.discountRate ?? 0;
  const discountedUnitPrice =
    discountRate > 0 ? cartItem.unitPrice * (1 - discountRate / 100) : null;

  const lineTotal = (discountedUnitPrice ?? cartItem.unitPrice) * cartItem.quantity;
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
          <View className='items-end'>
            {discountedUnitPrice != null && (
              <Text className='text-xs text-muted-foreground line-through'>
                {formatCurrency(cartItem.unitPrice)}/unit
              </Text>
            )}
            <Text className='text-sm text-muted-foreground'>
              {formatCurrency(discountedUnitPrice ?? cartItem.unitPrice)}/unit
            </Text>
          </View>
        )}
        {showQuantityAdjustor && <QuantityAdjustor cartItem={cartItem} />}
        <Text className='text-muted-foreground text-lg'>
          {formattedPrice}
          {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        </Text>
      </View>
    </Card>
  );
}
