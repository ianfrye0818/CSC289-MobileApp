import AddressList from '@/features/addresses/components/AddressList/AddressList';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView
      className='flex-1 bg-background p-4'
      edges={['left', 'right', 'bottom']}
    >
      <AddressList />
    </SafeAreaView>
  );
}
