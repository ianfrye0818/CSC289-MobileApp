import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useMembershipDiscount } from '@/features/account/hooks/useMembershipDiscount';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn, formatCurrency } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { ProductListItem } from '../types';

interface Props {
  product: ProductListItem;
  className?: string;
  /**
   * When true (e.g. suggestions on product detail), swap the active product in place
   * via route params instead of pushing — avoids stacking multiple detail screens.
   */
  navigateFromProductDetail?: boolean;
}

/**
 * This is the main product card component that is used to display a single product in the grid and horizontal list.
 * @param product - The product to display
 * @param className - The class name to apply to the card
 * @returns
 */
export function ProductCard({ product, className, navigateFromProductDetail }: Props) {
  const router = useRouter();
  // Discount math is server-mirrored: server stores the actual charged price
  // on the order; the catalogue endpoint returns list price only, so we
  // recompute the member's display price client-side from their tier.
  const { discountRate, applyDiscount } = useMembershipDiscount();
  const hasDiscount = discountRate > 0;
  const discountedPrice = applyDiscount(product.unitPrice);

  return (
    <Pressable
      className={cn('flex-1', className)}
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
      onPress={() =>
        navigateFromProductDetail
          ? router.setParams({ id: String(product.productId) })
          : router.push(`/products/${product.productId}`)
      }
    >
      {({ pressed }) => (
        <Card className={cn('gap-0 overflow-hidden py-0', pressed && 'opacity-80')}>
          {/* Image */}
          <Image
            source={{ uri: product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL }}
            className='w-full h-36 bg-muted'
            resizeMode='cover'
          />

          {/* Content */}
          <View className='p-3 gap-1'>
            {/* Category */}
            <Text
              className='text-muted-foreground text-xs'
              numberOfLines={1}
            >
              {product.category?.categoryName ?? '-'}
            </Text>

            {/* Name */}
            <Text
              className='font-semibold text-sm leading-snug'
              numberOfLines={2}
            >
              {product.productName}
            </Text>

            {/* Price + stock row */}
            <View className='flex-row items-center justify-between mt-1 gap-2'>
              <View className='flex-row items-center gap-2 flex-shrink'>
                {hasDiscount ? (
                  <>
                    <Text className='text-muted-foreground text-xs line-through'>
                      {formatCurrency(product.unitPrice)}
                    </Text>
                    <Text className='font-semibold text-primary text-sm'>
                      {formatCurrency(discountedPrice)}
                    </Text>
                  </>
                ) : (
                  <Text className='font-semibold text-foreground text-sm'>
                    {formatCurrency(product.unitPrice)}
                  </Text>
                )}
              </View>
              {!product.inStock && (
                <View className='bg-destructive/10 px-2 py-0.5 rounded-full'>
                  <Text className='text-destructive text-xs'>Out of stock</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
}
