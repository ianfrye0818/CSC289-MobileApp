import { DataWrapper } from '@/components/DataWrapper';
import UpdateAddressForm from '@/features/addresses/components/UpdateAddressForm';
import { useGetCurrentCustomerAddressById } from '@/features/addresses/hooks/useGetCurrentCustomerAddressById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditAddressScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetCurrentCustomerAddressById(Number(id));

  const router = useRouter();

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      className='flex-1 bg-background p-4'
    >
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      >
        {(address) => (
          <UpdateAddressForm
            address={address}
            onSuccess={() => router.back()}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}
