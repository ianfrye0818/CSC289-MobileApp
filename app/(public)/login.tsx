import LoginForm from '@/features/auth/components/LoginForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView>
      <LoginForm />
    </SafeAreaView>
  );
}
