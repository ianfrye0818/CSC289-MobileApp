import RegisterForm from '@/features/auth/components/RegisterForm';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background justify-center items-center px-4'>
      <RegisterForm />
    </SafeAreaView>
  );
}
