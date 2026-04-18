import LoginForm from '@/features/auth/components/LoginForm';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className='flex-1 bg-background justify-center items-center px-4'>
        <LoginForm />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
