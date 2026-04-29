import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { AddressResponseDto } from '@/features/addresses/types';
import { useRouter } from 'expo-router';
import { truncate, upperCase } from 'lodash';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Text } from 'react-native';
import { CheckoutFormValues } from '../checkout.schema';

type Props = {
  type: 'shipping' | 'billing';
};
export function AddressSelector({ type }: Props) {
  const { data: addresses } = useGetCurrentCustomerAddresses();
  const defaultAddress = addresses?.[0];
  const form = useFormContext<CheckoutFormValues>();
  const selectedAddressId = useWatch({ control: form.control, name: `${type}AddressId` });
  const router = useRouter();

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

  if (addresses !== undefined && addresses.length === 0) {
    return (
      <Card className='gap-0 px-4 py-3'>
        <Text className='text-2xl font-bold text-foreground mb-2'>
          {type === 'shipping' ? 'Shipping' : 'Billing'} Address
        </Text>
        <Text className='text-sm text-muted-foreground mb-3'>
          No addresses saved. Add one to continue.
        </Text>
        <Button onPress={() => router.push('/(auth)/addresses/add')}>Add Address</Button>
      </Card>
    );
  }

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
