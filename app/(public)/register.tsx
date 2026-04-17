import RegisterForm from '@/features/auth/components/RegisterForm';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView>
      <RegisterForm />
    </SafeAreaView>
  );
}
