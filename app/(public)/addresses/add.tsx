import AddAddressForm from '@/features/addresses/components/AddAddressForm';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function AddAddressScreen() {
  const router = useRouter();

  return (
    <View className='flex-1 px-4 py-10 bg-background'>
      <AddAddressForm onSuccess={() => router.back()} />
    </View>
  );
}
