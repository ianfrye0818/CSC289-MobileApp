import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import useAppForm from '@/hooks/useAppForm';
import { TAX_RATE } from '@/lib/constants';
import { formatCurrency, getRandomShippingCost } from '@/lib/utils';
import { getPaymentLabel, PaymentMethod } from '@/types/PaymentMethod.enum';
import { truncate, upperCase } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { Platform, ScrollView, View } from 'react-native';
import { CheckoutFormValues, checkoutSchema } from '../checkout.schema';
import { ShoppingCart } from '../types';
import { CheckoutHorizontalList } from './CheckoutHorizontalList';
import { PurchaseButton } from './PurchaseButton';

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
        <AddressCard type='shipping' />
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
        {!isBillingAddressSameAsShippingAddress && <AddressCard type='billing' />}

        {/* Payment methods */}
        <SelectPaymentCard />

        <PurchaseButton />
      </ScrollView>
    </FormProvider>
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

  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      form.setValue(`${type}AddressId`, defaultAddress.id);
    }
  }, [selectedAddressId, defaultAddress, form, type]);

  const getAddressLabel = (address?: AddressResponseDto) => {
    if (!address) return '';
    return upperCase(
      `${address.line1}, ${address.line2 || ''} ${address.city}, ${address.state} ${address.zipcode}`,
    );
  };

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground mb-2'>
        {type === 'shipping' ? 'Shipping' : 'Billing'} Address
      </Text>
      <Controller
        control={form.control}
        name={`${type}AddressId`}
        render={({ field }) => (
          <Select
            value={
              field.value != null
                ? {
                    label: truncate(getAddressLabel(addresses?.find((a) => a.id === field.value)), {
                      length: 30,
                    }),
                    value: String(field.value),
                  }
                : undefined
            }
            onValueChange={(option) => field.onChange(option ? Number(option.value) : undefined)}
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
    </Card>
  );
}

function SelectPaymentCard() {
  const form = useFormContext<CheckoutFormValues>();

  const filteredPaymentMethods = Object.values(PaymentMethod).filter((method) => {
    if (Platform.OS === 'ios' && method === PaymentMethod.GOOGLE_PAY) return false;
    if (Platform.OS === 'android' && method === PaymentMethod.APPLE_PAY) return false;
    return true;
  });

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground'>Payment Type</Text>
      <View className='pt-3 gap-1'>
        <Controller
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <View>
              <Select
                value={{ label: getPaymentLabel(field.value), value: field.value }}
                onValueChange={(option) => {
                  if (option?.value) field.onChange(option.value as PaymentMethod);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a payment method' />
                </SelectTrigger>
                <SelectContent>
                  {filteredPaymentMethods.map((method) => (
                    <SelectItem
                      key={method}
                      value={method}
                      label={getPaymentLabel(method)}
                    />
                  ))}
                </SelectContent>
              </Select>
              {field.value === 'CREDIT_CARD' && <CreditCardForm />}
            </View>
          )}
        />
      </View>
    </Card>
  );
}

function CreditCardForm() {
  return (
    <View className='py-2 my-4 border border-border rounded-md gap-2 px-2'>
      <InputField<typeof checkoutSchema>
        name='creditCard.cardNumber'
        label='Card Number'
        maxLength={16}
        required
      />
      <View className='flex-row w-full gap-2'>
        <View className='min-w-0 flex-1'>
          <InputField<typeof checkoutSchema>
            name='creditCard.expiryMonth'
            label='Month'
            maxLength={2}
            type='number'
            required
          />
        </View>
        <View className='min-w-0 flex-1'>
          <InputField<typeof checkoutSchema>
            name='creditCard.expiryYear'
            label='Year'
            maxLength={4}
            type='number'
            required
          />
        </View>
      </View>
      <InputField<typeof checkoutSchema>
        name='creditCard.cvc'
        label='CVC'
        maxLength={3}
        type='number'
        required
      />
    </View>
  );
}
