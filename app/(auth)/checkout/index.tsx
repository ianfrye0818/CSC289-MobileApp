import { DataWrapper } from '@/components/DataWrapper';
import { CheckoutDetails } from '@/features/cart/components/CheckoutDetailsScreen';
import { useCart } from '@/features/cart/hooks/useCart';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { data, isLoading, error } = useCart();
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
        {(cart) => {
          return <CheckoutDetails cart={cart} />;
        }}
      </DataWrapper>
    </SafeAreaView>
  );
}
