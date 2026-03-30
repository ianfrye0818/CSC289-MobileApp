import { Text } from '@/components/ui/text';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function AuthCartScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background p-4'>
      <Text>Cart</Text>
    </SafeAreaView>
  );
}
