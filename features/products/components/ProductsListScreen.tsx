import { DataWrapper } from '@/components/DataWrapper';
import NoProductsAvailable from '@/features/products/components/NoProductsAvailable';
import { useProducts } from '@/features/products/hooks/useProducts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from './ProductGrid';

export default function ProductsListScreen() {
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
