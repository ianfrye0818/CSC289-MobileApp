import RegisterForm from '@/features/auth/components/RegisterForm';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background px-4 pt-6'>
      <RegisterForm />
    </SafeAreaView>
  );
}
