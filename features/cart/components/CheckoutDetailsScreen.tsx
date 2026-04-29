import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { AddressResponseDto } from '@/features/addresses/types';
import { TAX_RATE } from '@/lib/constants';
import { formatCurrency, getRandomShippingCost } from '@/lib/utils';
import { getPaymentLabel, PaymentMethod } from '@/types/PaymentMethod.enum';
import { upperCase } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { CheckoutFormValues } from '../checkout.schema';
import { ShoppingCart } from '../types';
import { CheckoutHorizontalList } from './CheckoutHorizontalList';
import { PurchaseButton } from './PurchaseButton';

export function CheckoutDetails({ cart }: { cart: ShoppingCart }) {
  const items = cart.items;
  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
    [items],
  );
  const taxAmount = useMemo(() => totalPrice * TAX_RATE, [totalPrice]);
  const shippingCost = getRandomShippingCost();
  const finalAmount = useMemo(
    () => totalPrice + taxAmount + shippingCost,
    [totalPrice, taxAmount, shippingCost],
  );

  return (
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
      <AddressCard type='shipping' />

      {/* Billing Address */}
      {/* TODO: add checkbox to toggle billing address */}
      <AddressCard type='billing' />

      {/* Payment methods */}
      <SelectPaymentCard />

      <PurchaseButton />
    </ScrollView>
  );
}

function SummaryCardRow({ label, value }: { label: string; value: number }) {
  return (
    <View className='flex-row justify-between'>
      <Text className='text-lg font-medium text-foreground'>{label}</Text>
      <Text className='text-lg font-bold text-foreground'>{formatCurrency(value)}</Text>
    </View>
  );
}

function AddressCard({ type }: { type: 'shipping' | 'billing' }) {
  const { data: addresses } = useGetCurrentCustomerAddresses();
  const defaultAddress = addresses?.[0];
  const form = useFormContext<CheckoutFormValues>();
  const selectedAddressId = useWatch({ control: form.control, name: `${type}AddressId` });

  const handleSelect = (addressId: string | undefined) => {
    if (!addressId) return;
    form.setValue(`${type}AddressId`, Number(addressId));
  };

  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      form.setValue(`${type}AddressId`, defaultAddress.id);
    }
  }, [selectedAddressId, defaultAddress, form, type]);

  const getAddressLabel = (address: AddressResponseDto) => {
    return upperCase(
      `${address.line1}, ${address.line2 || ''} ${address.city}, ${address.state} ${address.zipcode}`,
    );
  };

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground'>Shipping Address</Text>
      <View className='gap-1'>
        <Text className='text-xs text-muted-foreground font-medium uppercase tracking-wide'>
          Shipping
        </Text>
        <Controller
          control={form.control}
          name={`${type}AddressId`}
          render={({ field }) => (
            <Select
              value={{ label: field.value?.toString() ?? '', value: field.value?.toString() ?? '' }}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select an address' />
              </SelectTrigger>
              <SelectContent className='w-[180px]'>
                {(addresses ?? []).map((ad) => (
                  <SelectItem
                    value={ad.id.toString()}
                    key={ad.id}
                    label={getAddressLabel(ad)}
                  />
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </View>
    </Card>
  );
}

function SelectPaymentCard() {
  const form = useFormContext<CheckoutFormValues>();
  const defaultPaymentMethod =
    Platform.OS === 'ios'
      ? PaymentMethod.APPLE_PAY
      : Platform.OS === 'android'
        ? PaymentMethod.GOOGLE_PAY
        : PaymentMethod.PAYPAL;

  useEffect(() => {
    if (!form.getValues('paymentMethod') && defaultPaymentMethod) {
      form.setValue('paymentMethod', defaultPaymentMethod);
    }
  }, [form.getValues('paymentMethod'), defaultPaymentMethod, form]);

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground'>Payment Type</Text>
      <View className='pt-3 gap-1'>
        <Controller
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <Select value={{ label: field.value, value: field.value }}>
              <SelectTrigger>
                <SelectValue placeholder='Select a payment method' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMethod).map((method) => (
                  <SelectItem
                    key={method}
                    value={method}
                    label={getPaymentLabel(method)}
                  />
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </View>
    </Card>
  );
}
