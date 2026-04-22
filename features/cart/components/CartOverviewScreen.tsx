import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../types';
import { CartCard } from './CartCard';
import NoCartItemsAvailable from './NoCartItemsAvailable';

export default function CartOverviewScreen() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useCart();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  };
  const totalPrice =
    data?.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) ?? 0;

  const cartId = data?.cartId;

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['left', 'right']}
    >
      <View className='flex-1'>
        <DataWrapper
          data={data?.items}
          isLoading={isLoading}
          error={error}
          noDataComponent={<NoCartItemsAvailable />}
        >
          {(cartItems: CartItem[]) => (
            <View className='flex-1 bg-pur'>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => String(item.inventoryId)}
                extraData={{ dataUpdatedAt, cartId }}
                contentContainerStyle={{ padding: 16, gap: 12, flex: 1 }}
                removeClippedSubviews={false}
                renderItem={({ item }) =>
                  cartId != null ? (
                    <CartCard
                      cartItem={item}
                      cartId={cartId}
                    />
                  ) : null
                }
                refreshing={isManualRefreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className='mb-1'>
                    <Text className='text-2xl font-bold text-foreground'>Items</Text>
                  </View>
                }
                ListEmptyComponent={<NoCartItemsAvailable />}
              />
              <CheckoutSection totalPrice={totalPrice} />
            </View>
          )}
        </DataWrapper>
      </View>
    </SafeAreaView>
  );
}

function CheckoutSection({ totalPrice }: { totalPrice: number }) {
  const router = useRouter();
  return (
    <View className='border-t border-border bg-background px-4 py-2 gap-2'>
      <View className='flex-row items-center justify-end gap-2 px-4'>
        <Text className='text-xs text-muted-foreground'>Subtotal</Text>
        <Text className='text-base font-bold text-foreground'>
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            totalPrice,
          )}
        </Text>
      </View>
      <Button
        className='w-full'
        onPress={() => router.push('/checkout')}
      >
        Checkout
      </Button>
    </View>
  );
}
