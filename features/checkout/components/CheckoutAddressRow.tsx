import { Checkbox } from '@/components/ui/checkbox';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { useAuthStore } from '@/features/auth/store';
import { Link } from 'expo-router';
import { upperCase } from 'lodash';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CheckoutFormValues } from '../checkoutSchema';

type Props =
  | { type: 'shipping' }
  | {
      type: 'billing';
      sameAsBilling: boolean;
      setSameAsBilling: (value: boolean) => void;
    };

export function CheckoutAddressRow(props: Props) {
  const form = useFormContext<CheckoutFormValues>();
  const user = useAuthStore((state) => state.user);
  const { data } = useGetCurrentCustomerAddresses();

  const fieldName = props.type === 'shipping' ? 'shippingAddressId' : 'billingAddressId';
  const addressId = useWatch({ control: form.control, name: fieldName });
  const error = form.formState.errors[fieldName];

  const selectedAddress = useMemo(
    () => data?.find((address) => address.id === addressId),
    [data, addressId],
  );

  const isBilling = props.type === 'billing';
  const sameAsBilling = isBilling ? props.sameAsBilling : false;

  return (
    <View className='py-2 border-b border-border gap-2'>
      <Text className='text-md font-semibold text-foreground'>
        {props.type === 'shipping' ? 'Shipping address' : 'Billing address'}
      </Text>

      {props.type === 'billing' && (
        <View className='flex-row items-center gap-2'>
          <Checkbox
            checked={props.sameAsBilling}
            onCheckedChange={(checked) => props.setSameAsBilling(!!checked)}
          />
          <Text className='text-sm text-foreground'>Same as shipping address</Text>
        </View>
      )}

      {!sameAsBilling && (
        <View className='gap-2'>
          {props.type === 'shipping' && (
            <Text className='text-sm text-muted-foreground'>
              Delivering to {user?.name ?? selectedAddress?.customerRef?.value ?? ''}
            </Text>
          )}
          <Text>
            {upperCase(selectedAddress?.line1)} {upperCase(selectedAddress?.line2)}{' '}
            {upperCase(selectedAddress?.city)}, {upperCase(selectedAddress?.state)}{' '}
            {selectedAddress?.zipcode} {upperCase(selectedAddress?.country)}
          </Text>
          <Link
            href={`/checkout/select-address?addressType=${props.type}&addressId=${addressId?.toString()}`}
            className='text-blue-500'
          >
            Change
          </Link>
        </View>
      )}

      {error && <Text className='text-sm text-destructive'>{error.message}</Text>}
    </View>
  );
}
