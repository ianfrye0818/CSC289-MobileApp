import { DataWrapper } from '@/components/DataWrapper';
import { Text } from '@/components/ui/text';
import { FlatList, View } from 'react-native';
import { ProductListItem } from '../../types';
import NoProductsAvailable from '../NoProductsAvailable';
import { ProductCard } from '../ProductCard';

interface Props {
  data: ProductListItem[];
  title?: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * This will be used in the future to display things like wishlist, recently viewed, suggested etc.
 * @param data - The data to display
 * @param title - The title to display
 * @param isLoading - Whether the data is loading
 * @param error - The error to display
 * @returns
 */
export function ProductHorizontalList({ data, isLoading, error, title }: Props) {
  return (
    <View className='gap-3'>
      {title && <Text className='text-lg font-semibold px-4'>{title}</Text>}
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
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                className='w-40 flex-none'
              />
            )}
          />
        )}
      </DataWrapper>
    </View>
  );
}
