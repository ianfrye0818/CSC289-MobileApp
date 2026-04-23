import { DataWrapper } from '@/components/DataWrapper';
import React from 'react';
import { Text, View } from 'react-native';
import { useGetCustomer } from '../hooks/useGetCustomer';

export default function CustomerList() {
  const { data, isLoading, error, refetch } = useGetCustomer();
  return (
    <View>
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      >
        {(customer) => <Text>Customer</Text>}
      </DataWrapper>
    </View>
  );
}
