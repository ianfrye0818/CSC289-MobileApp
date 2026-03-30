import { ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function NoProductsAvailable() {
  return (
    <View className='flex-1 items-center justify-center gap-3 p-8'>
      <ShoppingBag
        size={48}
        className='text-muted-foreground'
      />
      <Text className='text-muted-foreground text-center'>No products available</Text>
    </View>
  );
}
