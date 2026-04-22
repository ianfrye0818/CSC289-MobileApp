import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { useAuthStore } from '@/features/auth/store';
import { Link } from 'expo-router';
import { upperCase } from 'lodash';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CheckoutFormValues } from '../checkoutSchema';

export function CheckoutAddressRow() {
  const form = useFormContext<CheckoutFormValues>();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useGetCurrentCustomerAddresses();
  const addressId = useWatch({ control: form.control, name: 'addressId' });
  const selectedAddress = useMemo(
    () => data?.find((address) => address.id === addressId),
    [data, addressId],
  );

  return (
    <View className='py-2 border-b border-border gap-2'>
      <View className='gap-2'>
        <Text className='text-md font-semibold text-foreground'>
          Delivering to {user?.name ?? selectedAddress?.customerRef?.value ?? ''}
        </Text>
        <View>
          <Text>
            {upperCase(selectedAddress?.line1)} {upperCase(selectedAddress?.line2)}{' '}
            {upperCase(selectedAddress?.city)}, {upperCase(selectedAddress?.state)}{' '}
            {selectedAddress?.zipcode} {upperCase(selectedAddress?.country)}
          </Text>
        </View>
        <Link
          href={`/checkout/select-address?addressId=${addressId?.toString()}`}
          className='text-blue-500'
        >
          Change
        </Link>
      </View>
    </View>
  );
}
