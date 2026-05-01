import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ProductDetail } from '../types';

type Props = {
  product: ProductDetail;
  button?: React.ReactElement;
};

export function AddToCartButton({ product, button }: Props) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const [showAdded, setShowAdded] = useState(false);
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(
      { product, quantity: 1 },
      {
        onSuccess: () => {
          if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current);
          setShowAdded(true);
          addedTimeoutRef.current = setTimeout(() => {
            setShowAdded(false);
            addedTimeoutRef.current = null;
          }, 1000);
        },
      },
    );
  };

  return (
    <View className='px-4 pb-4 pt-2 border-t border-border'>
      {button ?? (
        <Button
          disabled={!product.inStock || isPending}
          onPress={handleAddToCart}
        >
          {isPending ? (
            <ActivityIndicator
              size='small'
              color='white'
            />
          ) : (
            <Text>{showAdded ? 'Added!' : 'Add to Cart'}</Text>
          )}
        </Button>
      )}
    </View>
  );
}
