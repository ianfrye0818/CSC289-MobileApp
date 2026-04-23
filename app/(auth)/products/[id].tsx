import { DataWrapper } from '@/components/DataWrapper';
import { ProductDetails } from '@/features/products/components/ProductDetails';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicProductDetailScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const { data, isLoading, error, refetch } = useProductDetails(Number(id));
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
        {(product) => <ProductDetails product={product} />}
      </DataWrapper>
    </SafeAreaView>
  );
}
