import { Text } from '@/components/ui/text';
import { formatCurrency } from '@/lib/utils';
import { View } from 'react-native';
import { OrderItem } from '../types';

interface Props {
  item: OrderItem;
}

/**
 * Displays a single line item within an order.
 * Shows product name, quantity, unit price, and line total.
 *
 * Designed to be reusable — also suitable for cart item display
 * where quantity and price per item are needed.
 */
export function OrderLineItem({ item }: Props) {
  const lineTotal = item.price * item.quantity;

  const formattedPrice = formatCurrency(item.price);

  const formattedTotal = formatCurrency(lineTotal);

  // Per-unit discount is server-computed (Inventory.Unit_Price - Order_Item.Amount).
  // Show it only when there's an actual savings — older orders may not carry it.
  const perUnitDiscount = item.discount ?? 0;
  const hasDiscount = perUnitDiscount > 0;
  const lineDiscount = perUnitDiscount * item.quantity;

  return (
    <View className='flex-row items-start justify-between py-3 border-b border-border'>
      {/* Left side: product name and quantity */}
      <View className='flex-1 gap-0.5 pr-4'>
        <Text className='text-foreground text-sm font-medium'>{item.name}</Text>
        <View className='flex-row items-baseline gap-2'>
          {hasDiscount && item.originalPrice != null && (
            <Text className='text-muted-foreground text-xs line-through'>
              {formatCurrency(item.originalPrice)}
            </Text>
          )}
          <Text className='text-muted-foreground text-xs'>
            {item.quantity} × {formattedPrice}
          </Text>
        </View>
        {hasDiscount && (
          <Text className='text-primary text-xs'>
            You saved {formatCurrency(lineDiscount)}
          </Text>
        )}
      </View>

      {/* Right side: line total */}
      <Text className='text-foreground text-sm font-semibold'>{formattedTotal}</Text>
    </View>
  );
}
