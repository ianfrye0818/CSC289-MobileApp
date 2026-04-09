import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function NoCartItemsAvailable() {
  return (
    <View className='flex-1 items-center justify-center gap-3 p-8'>
      <ShoppingCart
        size={48}
        className='text-muted-foreground'
      />
      <Text className='text-muted-foreground text-center text-base'>No items in your cart</Text>
      <Text className='text-muted-foreground text-center text-sm'>Your selected items will appear here.</Text>
    </View>
);
}