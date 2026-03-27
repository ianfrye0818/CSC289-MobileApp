import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PRODUCT_PLACEHOLDER_IMAGE_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { ProductListItem } from '../types';

interface Props {
  product: ProductListItem;
  className?: string;
}

/**
 * This is the main product card component that is used to display a single product in the grid and horizontal list.
 * @param product - The product to display
 * @param className - The class name to apply to the card
 * @returns
 */
export function ProductCard({ product, className }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/products/${product.productId}`);
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.unitPrice);

  return (
    <Pressable
      onPress={handlePress}
      className={cn('flex-1', className)}
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
    >
      {({ pressed }) => (
        <Card className={cn('gap-0 overflow-hidden py-0', pressed && 'opacity-80')}>
          {/* Image */}
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE_URL }}
              className='w-full h-36 bg-muted'
              resizeMode='cover'
            />
          ) : (
            <View className='w-full h-36 bg-muted items-center justify-center'>
              <Text className='text-muted-foreground text-xs'>No image</Text>
            </View>
          )}

          {/* Content */}
          <View className='p-3 gap-1'>
            {/* Category */}
            <Text
              className='text-muted-foreground text-xs'
              numberOfLines={1}
            >
              {product.category.categoryName}
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
              <Text className='font-semibold text-foreground text-sm'>{formattedPrice}</Text>
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
