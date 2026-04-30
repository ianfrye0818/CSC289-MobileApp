import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { useClearCart } from '../hooks/useClearCart';
import { CartItem } from '../types';
import { CartCard } from './CartCard';
import NoCartItemsAvailable from './NoCartItemsAvailable';

export default function CartOverviewScreen() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useCart();

  const cartId = data?.cartId;

  return (
    <SafeAreaView
      className='flex-1 bg-background pb-2'
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
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => String(item.inventoryId)}
                contentContainerStyle={{
                  padding: 16,
                  gap: 12,
                  flexGrow: 1,
                }}
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
                refreshing={isLoading}
                onRefresh={refetch}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View className='mb-1'>
                    <Text className='text-2xl font-bold text-foreground'>Items</Text>
                  </View>
                }
                ListEmptyComponent={<NoCartItemsAvailable />}
              />
              <Footer cartItems={cartItems} />
            </>
          )}
        </DataWrapper>
      </View>
    </SafeAreaView>
  );
}

function CheckoutButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  return (
    <Button
      disabled={disabled}
      onPress={() => {
        router.push('/checkout');
      }}
    >
      <Text>Checkout</Text>
    </Button>
  );
}

function Footer({ cartItems }: { cartItems: CartItem[] }) {
  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [cartItems],
  );

  function ClearCartButton() {
    const { mutate: clearCart } = useClearCart();

    const onConfirm = () => {
      Alert.alert(
        'Clear Cart',
        'Are you sure you want to clear your cart? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Clear',
            onPress: () => clearCart(),
            style: 'destructive',
          },
        ],
      );
    };

    return (
      <Button
        onPress={onConfirm}
        variant={'destructive'}
      >
        Clear Cart
      </Button>
    );
  }

  return (
    <View className='px-4 border-t border-border'>
      <View>
        <View className='flex-row justify-between'>
          <Text className='text-lg font-medium text-center text-foreground'>Subtotal</Text>
          <Text className='text-lg font-bold text-center text-foreground'>
            {formatCurrency(totalPrice)}
          </Text>
        </View>
      </View>
      <View className='gap-2'>
        <CheckoutButton />
        <ClearCartButton />
      </View>
    </View>
  );
}

// const clearCart = useClearCart();
// const [dialogOpen, setDialogOpen] = useState(false);
// const confirmClear = async () => {
//   if (!data?.cartId || !data?.items) return;

//   await Promise.all(
//     data.items.map((item) =>
//       removeCartItem.mutate({
//         cartId: data.cartId!,
//         dto: { inventoryId: item.inventoryId, quantity: item.quantity },
//       }),
//     ),
//   );

//   clearCart.mutate({ cartId: data.cartId });

//   setDialogOpen(false);
// };

// return (
//   <>
//     <DBox.Dialog
//       open={dialogOpen}
//       onOpenChange={setDialogOpen}
//     >
//       <DBox.DialogContent>
//         <DBox.DialogHeader>
//           <DBox.DialogTitle>Clear Cart?</DBox.DialogTitle>
//         </DBox.DialogHeader>

//         <Text>All items will be removed from your cart.</Text>

//         <DBox.DialogFooter>
//           <DBox.DialogClose asChild>
//             <Pressable
//               className='px-4 py-2 rounded bg-slate-200'
//               android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
//             >
//               <Text>Cancel</Text>
//             </Pressable>
//           </DBox.DialogClose>

//           <Pressable
//             className='px-4 py-2 rounded bg-red-500'
//             android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
//             onPress={confirmClear}
//           >
//             <Text className='text-white'>Clear</Text>
//           </Pressable>
//         </DBox.DialogFooter>
//       </DBox.DialogContent>
//     </DBox.Dialog>

//     <Button
//       disabled={!data || !data.items || data.items.length === 0}
//       onPress={() => setDialogOpen(true)}
//     >
//       <Text>Clear Cart</Text>
//     </Button>
//   </>
