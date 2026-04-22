import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { shippingAddressId, billingAddressId } = useLocalSearchParams() as {
    shippingAddressId?: string;
    billingAddressId?: string;
  };

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <CheckoutForm
        shippingAddressId={shippingAddressId}
        billingAddressId={billingAddressId}
      />
    </SafeAreaView>
  );
}
