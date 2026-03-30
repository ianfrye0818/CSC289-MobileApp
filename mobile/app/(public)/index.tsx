import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className='flex-1'>
      <View className='flex-1 justify-center items-center gap-4 px-4'>
        <Button
          className='w-full'
          onPress={() => router.navigate('/addresses')}
        >
          Addresses
        </Button>
      </View>
    </SafeAreaView>
  );
}
