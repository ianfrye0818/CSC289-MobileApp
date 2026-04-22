import { DataWrapper } from '@/components/DataWrapper';
import { useGetCurrentCustomerAddresses } from '@/features/addresses/hooks/useGetCurrentCustomerAddresses';
import { AddressResponseDto } from '@/features/addresses/types';
import { CheckoutSelectAddressAddressList } from '@/features/checkout/components/CheckoutSelectAddressAddressList';
import { useLocalSearchParams } from 'expo-router';
import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectAddressScreen() {
  const { addressId } = useLocalSearchParams() as { addressId?: string };
  const [localSelectedAddress, setLocalSelectedAddress] = useState<AddressResponseDto | null>(null);
  const { data, isLoading, error } = useGetCurrentCustomerAddresses();

  useEffect(() => {
    if (!isNil(addressId)) {
      setLocalSelectedAddress(data?.find((a) => a.id === Number(addressId)) ?? null);
    }
  }, [addressId, data]);

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
      >
        {(addresses) => (
          <CheckoutSelectAddressAddressList
            addresses={addresses}
            localSelectedAddress={localSelectedAddress}
            setLocalSelectedAddress={setLocalSelectedAddress}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}
