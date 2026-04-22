import { CartItem } from '@/features/cart/types';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Image, Text, View } from 'react-native';

type Props = {
  item: CartItem;
};

export function CheckoutItemCard({ item }: Props) {
  return (
    <View>
      <View className='flex-row items-center gap-2 px-3'>
        <Image
          source={{ uri: item.product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL }}
          className='w-10 h-10 rounded-md'
          resizeMode='cover'
        />
        <View className='flex-row items-center justify-between flex-1'>
          <Text className='text-md font-semibold text-foreground'>{item.product.productName}</Text>
          <Text className='text-md text-muted-foreground'>
            {item.quantity} × {formatCurrency(item.unitPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}
