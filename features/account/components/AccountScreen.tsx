import { Text } from '@/components/ui/text';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountCard } from './AccountCard';

export default function AccountScreen() {
  const { data: customer, isPending, isError } = useGetCustomer();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-6 gap-4">
        <Text variant="h3">My Account</Text>

        {isPending && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}

        {isError && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-destructive text-sm">
              Failed to load account details. Please try again.
            </Text>
          </View>
        )}

        {customer && <AccountCard customer={customer} />}
      </View>
    </SafeAreaView>
  );
}
