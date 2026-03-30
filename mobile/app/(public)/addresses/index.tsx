import AddressList from '@/features/addresses/components/AddressList/AddressList';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function Index() {
  return (
    <ScrollView contentContainerClassName='px-4 py-6 gap-4 flex-1'>
      <Text className='text-2xl font-bold text-foreground'>Addresses</Text>
      <AddressList customerId={1003} />
    </ScrollView>
  );
}
