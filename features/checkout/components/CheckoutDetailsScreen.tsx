import { formResolver } from '@/components/form-components/form-resolver';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import useAppForm from '@/hooks/useAppForm';
import { TAX_RATE } from '@/lib/constants';
import { getRandomShippingCost } from '@/lib/utils';
import { PaymentMethod } from '@/types/PaymentMethod.enum';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { ShoppingCart } from '../../cart/types';
import { CheckoutFormValues, checkoutSchema } from '../checkout.schema';
import { AddressSelector } from './AddressSelector';
import { CheckoutHorizontalList } from './CheckoutHorizontalList';
import { SelectPaymentCard } from './PaymentMethodSelector';
import { PurchaseButton } from './PurchaseButton';
import { SummaryCardRow } from './SummaryCardRow';

export function CheckoutDetails({ cart }: { cart: ShoppingCart }) {
  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] =
    useState(true);
  const form = useAppForm<CheckoutFormValues>({
    formName: 'CheckoutDetailsForm',
    resolver: formResolver(checkoutSchema),
    defaultValues: {
      cartId: cart.cartId,
      shippingCost: getRandomShippingCost(),
      billingAddressId: undefined,
      paymentMethod:
        Platform.OS === 'ios'
          ? PaymentMethod.APPLE_PAY
          : Platform.OS === 'android'
            ? PaymentMethod.GOOGLE_PAY
            : PaymentMethod.PAYPAL,
    },
  });
  const items = cart.items;
  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const taxAmount = useMemo(() => totalPrice * TAX_RATE, [totalPrice]);
  const shippingCost = useWatch({ control: form.control, name: 'shippingCost' });
  const shippingAddressId = useWatch({ control: form.control, name: 'shippingAddressId' });

  /** When billing is hidden ("same as shipping"), billing AddressSelector never mounts, so copy shipping once it is set / changes. */
  useEffect(() => {
    if (isBillingAddressSameAsShippingAddress && shippingAddressId != null) {
      form.setValue('billingAddressId', shippingAddressId);
    }
  }, [form, isBillingAddressSameAsShippingAddress, shippingAddressId]);

  const finalAmount = useMemo(
    () => totalPrice + taxAmount + shippingCost,
    [totalPrice, taxAmount, shippingCost],
  );

  const handleBillingAddressSameAsShippingAddressChange = () => {
    setIsBillingAddressSameAsShippingAddress(!isBillingAddressSameAsShippingAddress);
    if (isBillingAddressSameAsShippingAddress) {
      form.setValue('billingAddressId', undefined);
    } else {
      form.setValue('billingAddressId', form.getValues('shippingAddressId'));
    }
  };

  return (
    <FormProvider {...form}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className='gap-3'>
          <Text className='text-2xl font-bold text-foreground'>Cart</Text>
          <CheckoutHorizontalList items={cart} />
        </View>
        {/* Summary card */}
        <Card className='gap-0 px-4 py-3'>
          <Text className='text-2xl font-bold text-foreground'>Summary</Text>
          <View className='pt-3 gap-1'>
            <SummaryCardRow
              label='Subtotal'
              value={totalPrice}
            />
            <SummaryCardRow
              label='Tax'
              value={taxAmount}
            />
            <SummaryCardRow
              label='Shipping'
              value={shippingCost}
            />
            <SummaryCardRow
              label='Total'
              value={finalAmount}
            />
          </View>
        </Card>

        {/* Shipping address */}
        <AddressSelector type='shipping' />
        <View className='flex-row items-center gap-2'>
          <Checkbox
            id='billingAddressSameAsShippingAddress'
            checked={isBillingAddressSameAsShippingAddress}
            onCheckedChange={handleBillingAddressSameAsShippingAddressChange}
          />
          <Label onPress={handleBillingAddressSameAsShippingAddressChange}>
            Billing address is the same as shipping address
          </Label>
        </View>

        {/* Billing Address */}
        {!isBillingAddressSameAsShippingAddress && <AddressSelector type='billing' />}

        {/* Payment methods */}
        <SelectPaymentCard />

        <PurchaseButton />
      </ScrollView>
    </FormProvider>
  );
}
