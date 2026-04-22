import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { addressId } = useLocalSearchParams() as { addressId?: string };

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <CheckoutForm addressId={addressId} />
    </SafeAreaView>
  );
}
