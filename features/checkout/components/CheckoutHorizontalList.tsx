import { Text } from '@/components/ui/text';
import { FlatList, View } from 'react-native';
import { CartCard } from '../../cart/components/CartCard';
import { ShoppingCart } from '../../cart/types';

interface Props {
  items: ShoppingCart;
  title?: string;
}

/**
 * This will be used in the future to display things like wishlist, recently viewed, suggested etc.
 * @param data - The data to display
 * @param title - The title to display
 * @param isLoading - Whether the data is loading
 * @param error - The error to display
 * @returns
 */
export function CheckoutHorizontalList({ items, title }: Props) {
  return (
    <View className='gap-3'>
      {title && <Text className='text-lg font-semibold px-4'>{title}</Text>}
      <FlatList
        data={items.items}
        keyExtractor={(item) => String(item.product.productId)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        renderItem={({ item }) => (
          <CartCard
            cartItem={item}
            cartId={items.cartId ?? 0}
            itemCount={item.quantity}
            showQuantityAdjustor={false}
          />
        )}
      />
    </View>
  );
}
