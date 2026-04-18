import AddAddressForm from '@/features/addresses/components/AddAddressForm';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddAddressScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      className='flex-1 bg-background p-4'
      edges={['left', 'right', 'bottom']}
    >
      <AddAddressForm onSuccess={() => router.back()} />
    </SafeAreaView>
  );
}
