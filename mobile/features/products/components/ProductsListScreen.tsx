import { DataWrapper } from '@/components/DataWrapper';
import NoProductsAvailable from '@/features/products/components/NoProductsAvailable';
import { useProducts } from '@/features/products/hooks/useProducts';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from './ProductGrid';

const SafeAreaView = styled(RNSafeAreaView);


export default function AuthProductsScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useProducts();
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        noDataComponent={<NoProductsAvailable />}
      >
        {(products) => (
          <ProductGrid
            products={products}
            refetch={refetch}
            isRefetching={isRefetching}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}
