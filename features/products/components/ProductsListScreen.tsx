import { DataWrapper } from '@/components/DataWrapper';
import NoProductsAvailable from '@/features/products/components/NoProductsAvailable';
import { useProducts } from '@/features/products/hooks/useProducts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductGrid } from './ProductGrid';

export default function ProductsListScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useProducts();
  return (
    <SafeAreaView
      className='flex-1 bg-background pb-2'
      edges={['left', 'right']}
    >
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        noDataComponent={<NoProductsAvailable />}
        refetch={refetch}
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
