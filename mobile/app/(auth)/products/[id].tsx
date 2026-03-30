import { DataWrapper } from '@/components/DataWrapper';
import { ProductDetails } from '@/features/products/components/ProductDetails';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useProductDetails(Number(id));

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
        {(product) => {
          return <ProductDetails product={product} />;
        }}
      </DataWrapper>
    </SafeAreaView>
  );
}
