import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../types';
import { CartCard } from './CartCard';
import NoCartItemsAvailable from './NoCartItemsAvailable';

export default function CartOverviewScreen() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useCart();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setIsManualRefreshing(false);
  };
  const totalPrice =
    data?.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) ?? 0;

  const cartId = data?.cartId;

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['left', 'right', 'bottom']}>
      <View className='flex-1'>
        <DataWrapper
          data={data?.items}
          isLoading={isLoading}
          error={error}
          noDataComponent={<NoCartItemsAvailable />}
        >
          {(cartItems: CartItem[]) => (
            <FlatList
              data={cartItems}
              keyExtractor={(item) => String(item.inventoryId)}
              extraData={{ dataUpdatedAt, cartId }}
              contentContainerStyle={{ padding: 16, gap: 12 }}
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
          )}
        </DataWrapper>
      </View>

      {/* Checkout button */}
      <CheckoutButton
        cartItems={data?.items}
        totalPrice={totalPrice}
        router={router}
      />
    </SafeAreaView>
  );
}

function CheckoutButton({
  cartItems,
  totalPrice,
  router,
}: {
  cartItems?: CartItem[];
  totalPrice: number;
  router: any;
}) {
  const { isPending } = useCart();
  return (
    <View className='px-4 border-t border-border'>
      <Text className='text-lg font-medium text-center text-foreground'>Subtotal</Text>
      <Text className='text-lg font-bold text-center text-foreground'>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
          totalPrice,
        )}
      </Text>
      <Button
        disabled={!cartItems || cartItems.length === 0}
        onPress={() => {
          router.push('/cart/checkout');
        }}
      >
        {isPending ? (
          <ActivityIndicator
            size='small'
            color='white'
          />
        ) : (
        <Text>Checkout</Text>
        )}
      </Button>
    </View>
  );
}
