import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
export default function AuthOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Order Detail</Text>
    </View>
  );
}
