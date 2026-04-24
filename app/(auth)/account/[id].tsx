import { DataWrapper } from '@/components/DataWrapper';
import UpdateCustomerForm from '@/features/account/components/UpdateCustomerForm';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditAccountScreen() {
  const { data, isLoading, error } = useGetCustomer();
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
      >
        {(customer) => (
          <UpdateCustomerForm
            customer={customer}
            onSuccess={() => router.back()}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}