import { DataWrapper } from '@/components/DataWrapper';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useGetCustomer } from '@/features/account/hooks/useGetCustomer';
import { Reviews } from '@/features/reviews/components/Reviews';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Image, View } from 'react-native';
import { ProductDetail, ProductInventory, ProductListItem } from '../types';
import { ProductHorizontalList } from './ProductHorizontalList';

export type ProductDetailsSuggestedProps = {
  data: ProductListItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function ProductDetails({
  product,
  suggested,
}: {
  product: ProductDetail;
  suggested: ProductDetailsSuggestedProps;
}) {
  const { data, isLoading, error, refetch } = suggested;

  const { data: customer } = useGetCustomer();
  const discountRate = customer?.memberDetails?.discountRate ?? 0;
  const discountedPrice =
    discountRate > 0 && product.lowestPrice != null
      ? product.lowestPrice * (1 - discountRate / 100)
      : null;

  const getTotalQuantity = (inventory: ProductInventory[]) =>
    inventory?.reduce((sum, inv) => sum + inv.quantity, 0) ?? 0;
  const totalQuantity = getTotalQuantity(product.inventory);
  return (
    <View className='gap-4'>
      {/* Header row: image + info */}
      <View className='flex-row gap-4'>
        {product!.imageUrl ? (
          <Image
            source={{ uri: product!.imageUrl }}
            className='w-28 h-28 rounded-xl bg-muted'
            resizeMode='cover'
          />
        ) : (
          <Image
            source={{ uri: PRODUCT_PLACEHOLDER_IMAGE_URL }}
            className='w-28 h-28 rounded-xl bg-muted'
            resizeMode='cover'
          />
        )}

        <View className='flex-1 justify-center gap-1'>
          <Text className='text-muted-foreground text-xs'>
            {product.category?.categoryName ?? '-'}
          </Text>
          <Text className='font-bold text-base leading-snug'>{product.productName ?? '-'}</Text>
          <Text className='text-muted-foreground text-sm'>
            Currently in stock: {totalQuantity ?? 0}
          </Text>
          {discountedPrice != null ? (
            <>
              <Text className='text-muted-foreground text-xs line-through'>
                {formatCurrency(product.lowestPrice)}
              </Text>
              <Text className='font-semibold text-foreground text-base'>
                {formatCurrency(discountedPrice)}
              </Text>
            </>
          ) : (
            <Text className='font-semibold text-foreground text-base'>
              {formatCurrency(product.lowestPrice)}
            </Text>
          )}
        </View>
      </View>

      {/* Stock status badge */}
      <View className='flex-row'>
        {product!.inStock ? (
          <Badge variant={'success'}>
            <Text>In Stock</Text>
          </Badge>
        ) : (
          <Badge variant={'destructive'}>
            <Text>Out of Stock</Text>
          </Badge>
        )}
      </View>

      {/* Description */}
      <View className='gap-1'>
        <Text className='text-foreground leading-relaxed'>
          {product.productDescription ?? 'No description available.'}
        </Text>
      </View>

      {/* Supplier */}
      <Text className='text-muted-foreground text-xs'>
        Supplied by {product.supplier?.supplierName ?? '-'}
      </Text>

      {/* Suggested products */}
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      >
        {(products) => {
          return (
            <View className='gap-3'>
              <Text className='font-semibold text-base'>Suggested</Text>
              <ProductHorizontalList
                products={products}
                navigateFromProductDetail
              />
            </View>
          );
        }}
      </DataWrapper>

      <Reviews productId={product.productId} />
    </View>
  );
}
