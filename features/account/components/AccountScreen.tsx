import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
import { useAuthStore } from '@/features/auth/store';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountCard } from './AccountCard';
import { MemberCard } from './MemberCard';

export default function AccountScreen() {
  const logout = useAuthStore((state) => state.logout);
  const { data: customer, isPending, isError } = useGetCustomer();
  const router = useRouter();

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['left', 'right', 'bottom']}
    >
      <View className='flex-1 px-4 pt-6 gap-4'>
        <Text variant='h3'>My Account</Text>

        {isPending && (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator />
          </View>
        )}

        {isError && (
          <View className='flex-1 items-center justify-center'>
            <Text className='text-destructive text-sm'>
              Failed to load account details. Please try again.
            </Text>
          </View>
        )}

        {customer && <AccountCard customer={customer} />}
        {customer && <MemberCard customer={customer} />}
        {customer && (
          <Button
            variant='outline'
            onPress={() => router.push('/addresses')}
          >
            {' '}
            Addresses
          </Button>
        )}
      </View>
      <View className='px-4'>
        <Button
          variant='default'
          onPress={() => logout()}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
}
