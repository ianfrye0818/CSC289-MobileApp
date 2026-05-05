import { formResolver } from '@/components/form-components/form-resolver';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useMembershipDiscount } from '@/features/account/hooks/useMembershipDiscount';
import useAppForm from '@/hooks/useAppForm';
import { TAX_RATE } from '@/lib/constants';
import { formatCurrency, getRandomShippingCost } from '@/lib/utils';
import { PaymentMethod } from '@/types/PaymentMethod.enum';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { ShoppingCart } from '../../cart/types';
import { CheckoutFormValues, checkoutSchema } from '../checkout.schema';
import { AddressSelector } from './AddressSelector';
import { CheckoutHorizontalList } from './CheckoutHorizontalList';
import { PaymentMethodSelector } from './PaymentMethodSelector';
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
  // Pre-discount subtotal — used as the "list price" on the summary so the
  // member can see the savings explicitly as its own line.
  const originalSubtotal = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const { discountRate, applyDiscount } = useMembershipDiscount();
  const hasDiscount = discountRate > 0;
  // Discounted subtotal mirrors what the server will store on Order_Item.Amount.
  // Tax is then computed on the discounted amount to match the server.
  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + applyDiscount(item.unitPrice) * item.quantity, 0),
    [items, applyDiscount],
  );
  const discountAmount = originalSubtotal - totalPrice;
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
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
                value={hasDiscount ? originalSubtotal : totalPrice}
              />
              {hasDiscount && (
                <View className='flex-row justify-between'>
                  <Text className='text-lg font-medium text-foreground'>
                    Discount ({discountRate}%)
                  </Text>
                  <Text className='text-lg font-bold text-primary'>
                    -{formatCurrency(discountAmount)}
                  </Text>
                </View>
              )}
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
          <PaymentMethodSelector />

          <PurchaseButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </FormProvider>
  );
}
