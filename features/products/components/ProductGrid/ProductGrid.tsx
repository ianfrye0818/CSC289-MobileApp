import { DataWrapper } from '@/components/DataWrapper';
import { useProducts } from '@/features/products/hooks/useProducts';
import { FlatList, useWindowDimensions } from 'react-native';
import NoProductsAvailable from '../NoProductsAvailable';
import { ProductCard } from '../ProductCard';

export function ProductGrid() {
  const { data, isLoading, error } = useProducts();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;

  return (
    <DataWrapper
      data={data}
      isLoading={isLoading}
      error={error}
      noDataComponent={<NoProductsAvailable />}
    >
      {(products) => (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.productId)}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </DataWrapper>
  );
}
