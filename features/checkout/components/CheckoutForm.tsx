import { DataWrapper } from '@/components/DataWrapper';
import { formResolver } from '@/components/form-components/form-resolver';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { useCart } from '@/features/cart/hooks/useCart';
import { ShoppingCart } from '@/features/cart/types';
import useAppForm from '@/hooks/useAppForm';
import { PaymentMethod } from '@/types/PaymentMethod.enum';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { FlatList, Platform, Text, View } from 'react-native';
import { CheckoutFormValues, checkoutSchema } from '../checkoutSchema';
import { getRandomShippingCost } from '../utils/GetRandomShippingCost';
import { CheckoutAddressRow } from './CheckoutAddressRow';
import { CheckoutItemCard } from './CheckoutItemCard';
import { CheckoutPaymentMethodRow } from './CheckoutPaymentMethodRow';
import { CheckoutPlaceOrderButton } from './CheckoutPlaceOrderButton';
import { CheckoutTotalsRow } from './CheckoutTotalsRow';

type CheckoutFormProps = {
  shippingAddressId?: string;
  billingAddressId?: string;
};

export function CheckoutForm({ shippingAddressId, billingAddressId }: CheckoutFormProps) {
  const { data, isLoading, error, refetch } = useCart();
  const { data: addresses, isLoading: isAddressesLoading } = useGetCurrentCustomerAddresses();
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const form = useAppForm<CheckoutFormValues>({
    formName: 'CheckoutForm',
    resolver: formResolver(checkoutSchema),
    defaultValues: {
      cartId: data?.cartId ?? 0,
      shippingAddressId: undefined,
      billingAddressId: undefined,
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
  }, [data?.cartId]);

  useEffect(() => {
    if (!isNil(shippingAddressId)) {
      form.setValue('shippingAddressId', Number(shippingAddressId));
    } else if (addresses && addresses.length > 0) {
      form.setValue('shippingAddressId', addresses[0].id);
    }
  }, [shippingAddressId, addresses]);

  useEffect(() => {
    if (!isNil(billingAddressId)) {
      form.setValue('billingAddressId', Number(billingAddressId));
      setSameAsBilling(false);
    } else if (addresses && addresses.length > 0 && isNil(billingAddressId)) {
      form.setValue('billingAddressId', addresses[0].id);
    }
  }, [billingAddressId, addresses]);

  // Mirror shipping → billing when sameAsBilling is toggled on
  useEffect(() => {
    if (sameAsBilling) {
      const currentShipping = form.getValues('shippingAddressId');
      form.setValue('billingAddressId', currentShipping);
    }
  }, [sameAsBilling]);

  // Keep billing in sync with shipping while sameAsBilling is true
  useEffect(() => {
    if (!sameAsBilling) return;
    const subscription = form.watch((values) => {
      if (values.billingAddressId !== values.shippingAddressId) {
        form.setValue('billingAddressId', values.shippingAddressId);
      }
    });
    return () => subscription.unsubscribe();
  }, [sameAsBilling]);

  return (
    <DataWrapper
      data={data}
      isLoading={isLoading || isAddressesLoading}
      refetch={refetch}
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
            ListHeaderComponent={
              <ListHeader
                cart={cart}
                sameAsBilling={sameAsBilling}
                setSameAsBilling={setSameAsBilling}
              />
            }
          />
        </FormProvider>
      )}
    </DataWrapper>
  );
}

type ListHeaderProps = {
  cart: ShoppingCart;
  sameAsBilling: boolean;
  setSameAsBilling: (value: boolean) => void;
};

function ListHeader({ cart, sameAsBilling, setSameAsBilling }: ListHeaderProps) {
  return (
    <View className='gap-2'>
      <CheckoutPlaceOrderButton />
      <CheckoutTotalsRow cart={cart} />
      <CheckoutAddressRow type='shipping' />
      <CheckoutAddressRow
        type='billing'
        sameAsBilling={sameAsBilling}
        setSameAsBilling={setSameAsBilling}
      />
      <CheckoutPaymentMethodRow />
      <Text className='text-md font-semibold text-foreground'>Items</Text>
    </View>
  );
}
