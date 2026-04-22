import { ShoppingCart } from '@/features/cart/types';
import { TAX_RATE } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { useFormContext, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import { CheckoutFormValues } from '../checkoutSchema';

type Props = {
  cart: ShoppingCart;
};

export function CheckoutTotalsRow({ cart }: Props) {
  const form = useFormContext<CheckoutFormValues>();
  const shippingCost = useWatch({ control: form.control, name: 'shippingCost' });
  const subtotal = cart.subtotal;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + shippingCost;
  return (
    <View className='py-4 border-b border-border gap-2'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xs text-muted-foreground'>Items:</Text>
        <Text className='text-xs text-foreground'>{formatCurrency(subtotal)}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xs text-muted-foreground'>Estimated tax to be collected:</Text>
        <Text className='text-xs text-foreground'>{formatCurrency(tax)}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-xs text-muted-foreground'>Estimated shipping cost:</Text>
        <Text className='text-xs text-foreground'>{formatCurrency(shippingCost)}</Text>
      </View>
      <View className='flex-row items-center justify-between'>
        <Text className='text-md font-semibold text-foreground'>Total</Text>
        <Text className='text-md text-foreground'>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}
