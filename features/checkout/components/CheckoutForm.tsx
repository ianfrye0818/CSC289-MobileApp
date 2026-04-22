import { DataWrapper } from '@/components/DataWrapper';
import { formResolver } from '@/components/form-components/form-resolver';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { useCart } from '@/features/cart/hooks/useCart';
import { ShoppingCart } from '@/features/cart/types';
import useAppForm from '@/hooks/useAppForm';
import { PaymentMethod } from '@/types/PaymentMethod.enum';
import { isNil } from 'lodash';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, Platform, Text, View } from 'react-native';
import { CheckoutFormValues, checkoutSchema } from '../checkoutSchema';
import { getRandomShippingCost } from '../utils/GetRandomShippingCost';
import { CheckoutAddressRow } from './CheckoutAddressRow';
import { CheckoutItemCard } from './CheckoutItemCard';
import { CheckoutPaymentMethodRow } from './CheckoutPaymentMethodRow';
import { CheckoutPlaceOrderButton } from './CheckoutPlaceOrderButton';
import { CheckoutTotalsRow } from './CheckoutTotalsRow';

export function CheckoutForm({ addressId }: { addressId?: string }) {
  const { data, isLoading, error } = useCart();
  const { data: addresses, isLoading: isAddressesLoading } = useGetCurrentCustomerAddresses();
  const form = useAppForm<CheckoutFormValues>({
    formName: 'CheckoutForm',
    resolver: formResolver(checkoutSchema),
    defaultValues: {
      cartId: data?.cartId ?? 0,
      addressId: undefined,
      paymentMethod: Platform.OS === 'ios' ? PaymentMethod.APPLE_PAY : PaymentMethod.GOOGLE_PAY,
      shippingCost: getRandomShippingCost(),
    },
  });

  useEffect(() => {
    if (data?.cartId != null && data.cartId > 0 && form.getValues('cartId') !== data.cartId) {
      form.reset({
        ...form.getValues(),
        cartId: data.cartId,
      });
    }
  }, [data?.cartId, form]);

  useEffect(() => {
    if (!isNil(addressId)) {
      form.setValue('addressId', Number(addressId));
    } else if (addresses && addresses.length > 0) {
      form.setValue('addressId', addresses[0].id);
    }
  }, [addressId, addresses, form]);

  return (
    <DataWrapper
      data={data}
      isLoading={isLoading || isAddressesLoading}
      error={error}
    >
      {(cart) => (
        <FormProvider {...form}>
          <FlatList
            data={cart.items}
            renderItem={({ item }) => <CheckoutItemCard item={item} />}
            keyExtractor={(item) => item.inventoryId.toString()}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            removeClippedSubviews={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<ListHeader cart={cart} />}
          />
        </FormProvider>
      )}
    </DataWrapper>
  );
}

type ListHeaderProps = {
  cart: ShoppingCart;
};

function ListHeader({ cart }: ListHeaderProps) {
  return (
    <View className='gap-2'>
      <CheckoutPlaceOrderButton />
      <CheckoutTotalsRow cart={cart} />
      <CheckoutAddressRow />
      <CheckoutPaymentMethodRow />
      <Text className='text-md font-semibold text-foreground'>Items</Text>
    </View>
  );
}
