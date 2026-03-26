import { Text } from '@/components/ui/text';
import AddressList from '@/features/addresses/components/AddressList';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1'>
      <ScrollView contentContainerClassName='p-4 gap-4'>
        <Text className='text-2xl font-bold text-foreground'>Addresses</Text>
        <AddressList customerId={1003} />
      </ScrollView>
    </SafeAreaView>
  );
}
