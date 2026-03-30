import { SearchBar } from '@/components/SearchBar';
import { useState } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { ProductListItem } from '../types';
import NoProductsAvailable from './NoProductsAvailable';
import { ProductCard } from './ProductCard';

interface Props {
  products: ProductListItem[];
  refetch: () => void;
  isRefetching: boolean;
}

export function ProductGrid({ products, refetch, isRefetching }: Props) {
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;
  const [query, setQuery] = useState('');

  const filteredProducts = products?.filter((p) =>
    p.productName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => String(item.productId)}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
      renderItem={({ item }) => <ProductCard product={item} />}
      refreshing={isRefetching}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className='mb-1'>
          <SearchBar
            value={query}
            onSearch={setQuery}
            placeholder='Search products...'
          />
        </View>
      }
      ListEmptyComponent={<NoProductsAvailable />}
    />
  );
}
