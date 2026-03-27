import { ProductGrid } from '@/features/products/components/ProductGrid/ProductGrid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ProductGrid />
    </SafeAreaView>
  );
}
