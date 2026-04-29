import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import * as DBox from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { useClearCart } from '../hooks/useClearCart';
import { useRemoveCartItem } from '../hooks/useRemoveCartItem';
import { CartItem, ShoppingCart } from '../types';
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
  const totalPrice = data?.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) ?? 0;

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
                      showQuantityAdjustor={true}
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

        {/* Clear cart button */}
        <ClearCartButton
          data={data}
        />

        {/* Checkout button */}
        <CheckoutButton
          cartItems={data?.items}
          totalPrice={totalPrice}
          router={router}
        />
      </SafeAreaView>
  );
}

function ClearCartButton({ 
  data,
}: { 
  data?: ShoppingCart;
}) {
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const [dialogOpen, setDialogOpen] = useState(false);
  const confirmClear = async () => {
    if (!data?.cartId || !data?.items) return;

    await Promise.all(
      data.items.map(item =>
        removeCartItem.mutate({
          cartId: data.cartId!,
          dto: { inventoryId: item.inventoryId , quantity: item.quantity },
        })
      )
    );

    clearCart.mutate({ cartId: data.cartId });
    
    setDialogOpen(false);
};

  return (
    <>
      <DBox.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DBox.DialogContent>
            <DBox.DialogHeader>
              <DBox.DialogTitle>Clear Cart?</DBox.DialogTitle>
            </DBox.DialogHeader>

            <Text>All items will be removed from your cart.</Text>

            <DBox.DialogFooter>
              <DBox.DialogClose asChild>
                <Pressable
                  className="px-4 py-2 rounded bg-slate-200"
                  android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                >
                  <Text>Cancel</Text>
                </Pressable>
              </DBox.DialogClose>

              <Pressable
                className="px-4 py-2 rounded bg-red-500"
                android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
                onPress={confirmClear}
              >
                <Text className="text-white">Clear</Text>
              </Pressable>
            </DBox.DialogFooter>
          </DBox.DialogContent>
        </DBox.Dialog>

        <Button
          disabled={!data || !data.items || data.items.length === 0}
          onPress={() => setDialogOpen(true)}
        >
          <Text>Clear Cart</Text>
        </Button>
      </>
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
