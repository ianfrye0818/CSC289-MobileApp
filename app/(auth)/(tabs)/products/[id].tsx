import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
export default function AuthProductDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Product Detail {id}</Text>
    </View>
  );
}
