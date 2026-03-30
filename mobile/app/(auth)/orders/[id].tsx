import { DataWrapper } from '@/components/DataWrapper';
import OrderDetailScreen from '@/features/orders/components/OrderDetailScreen';
import { useOrderDetails } from '@/features/orders/hooks/useOrderDetails';
import { OrderDetails } from '@/features/orders/types';
import { useLocalSearchParams } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);


/**
 * Order detail route — fetches and displays full order information.
 * Follows the same DataWrapper pattern as the product detail screen.
 */
export default function AuthOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useOrderDetails(Number(id));

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
      >
        {(order) => <OrderDetailScreen order={order as unknown as OrderDetails} />}
      </DataWrapper>
    </SafeAreaView>
  );
}
