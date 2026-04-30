import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
import { useAuthStore } from '@/features/auth/store';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountCard } from './AccountCard';
import { MemberCard } from './MemberCard';

export default function AccountScreen() {
  const { data, isPending, error, refetch, isFetching } = useGetCustomer();
  const refreshing = isFetching && !isPending;
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView
      className='flex-1 bg-background pb-2'
      edges={['left', 'right']}
    >
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className='flex-1 px-4 pt-6 gap-4'>
          <Text variant='h3'>My Account</Text>

          <DataWrapper
            data={data}
            isLoading={isPending}
            error={error}
            refetch={refetch}
          >
            {(customer) => (
              <>
                <AccountCard customer={customer} />
                <MemberCard customer={customer} />
                <Button
                  variant='outline'
                  onPress={() => router.push('/addresses')}
                >
                  {' '}
                  Addresses
                </Button>
                <Button
                  className='mt-auto w-full'
                  variant='default'
                  onPress={logout}
                >
                  {' '}
                  Logout
                </Button>
              </>
            )}
          </DataWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
