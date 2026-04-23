import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useGetCurrentCustomerAddresses } from '../../hooks/useGetCurrentCustomerAddresses';
import { AddressRow } from './AddressRow';

export default function AddressList() {
  const { data, isLoading, error, refetch } = useGetCurrentCustomerAddresses();
  const router = useRouter();

  return (
    <View className='flex-1'>
      <DataWrapper
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        data={data}
      >
        {(addresses) => (
          <View className='rounded-xl border border-border bg-card'>
            {addresses.length === 0 ? (
              <View className='items-center gap-2 py-10'>
                <MapPin
                  size={32}
                  className='text-muted-foreground'
                />
                <Text className='text-sm text-muted-foreground'>No saved addresses yet.</Text>
              </View>
            ) : (
              addresses.map((address, index) => (
                <View key={address.id}>
                  <View className='px-4'>
                    <AddressRow address={address} />
                  </View>
                  {index < addresses.length - 1 && <View className='h-px bg-border mx-4' />}
                </View>
              ))
            )}
          </View>
        )}
      </DataWrapper>
      <Button
        className='mt-auto w-full'
        onPress={() => router.push('/addresses/add')}
      >
        Add Address
      </Button>
    </View>
  );
}
