import { DataWrapper } from '@/components/DataWrapper';
import OrderDetailScreen from '@/features/orders/components/OrderDetailScreen';
import { useOrderDetails } from '@/features/orders/hooks/useOrderDetails';
import { OrderDetails } from '@/features/orders/types';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Order detail route — fetches and displays full order information.
 * Follows the same DataWrapper pattern as the product detail screen.
 */
export default function AuthOrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useOrderDetails(Number(id));

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      >
        {(order) => <OrderDetailScreen order={order as unknown as OrderDetails} />}
      </DataWrapper>
    </SafeAreaView>
  );
}
