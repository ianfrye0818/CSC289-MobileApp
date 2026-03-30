import { DataWrapper } from '@/components/DataWrapper';
import React from 'react';
import { Text, View } from 'react-native';
import { useGetCustomer } from '../hooks/useGetCustomer';

export default function CustomerList() {
  const { data, isLoading, error } = useGetCustomer();
  return (
    <View>
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
      >
        {(customer) => <Text>Customer</Text>}
      </DataWrapper>
    </View>
  );
}
