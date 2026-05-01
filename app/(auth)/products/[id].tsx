import { DataWrapper } from '@/components/DataWrapper';
import { AddToCartButton } from '@/features/products/components/AddToCartButton';
import { ProductDetails } from '@/features/products/components/ProductDetails';
import { useGetSuggestedProducts } from '@/features/products/hooks/useGetSuggestedProducts';
import { useProductDetails } from '@/features/products/hooks/useProductDetails';
import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PublicProductDetailScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const productId = Number(id);
  const productQuery = useProductDetails(productId);
  const suggestedQuery = useGetSuggestedProducts(productId, {
    enabled: !!productQuery.data,
  });

  const refreshing =
    (productQuery.isFetching && !productQuery.isPending) ||
    (!!productQuery.data && suggestedQuery.isFetching && !suggestedQuery.isPending);

  const handleRefresh = () => {
    void Promise.all([productQuery.refetch(), suggestedQuery.refetch()]);
  };

  return (
    <SafeAreaView
      className='flex-1 bg-background'
      edges={['bottom']}
    >
      <View className='flex-1'>
        <DataWrapper
          data={productQuery.data}
          isLoading={productQuery.isPending}
          error={productQuery.error}
          refetch={productQuery.refetch}
        >
          {(product) => (
            <>
              <ScrollView
                className='flex-1'
                contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16 }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
              >
                <ProductDetails
                  product={product}
                  suggested={{
                    data: suggestedQuery.data,
                    isLoading: suggestedQuery.isLoading,
                    error: suggestedQuery.error,
                    refetch: suggestedQuery.refetch,
                  }}
                />
              </ScrollView>
              <AddToCartButton product={product} />
            </>
          )}
        </DataWrapper>
      </View>
    </SafeAreaView>
  );
}
