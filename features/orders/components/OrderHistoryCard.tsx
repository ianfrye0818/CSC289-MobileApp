import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn, formatCurrency } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { OrderListItem } from '../types';

/**
 * Maps a status string to a Badge variant.
 * Extend this as needed when backend status values are finalised.
 */
const statusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
      return 'success' as const;
    case 'CANCELLED':
    case 'FAILED':
      return 'destructive' as const;
    case 'PROCESSING':
    case 'SHIPPED':
      return 'default' as const;
    case 'PENDING':
    default:
      return 'secondary' as const;
  }
};

interface Props {
  order: OrderListItem;
  /**
   * Optional — not currently returned by GET /orders.
   * Ready to render once the backend adds it to OrderListResponseDto.
   */
  /**
   * Optional — not currently returned by GET /orders.
   * Accepts any status string; mapped to a Badge variant automatically.
   */
  status?: string;
}

/**
 * Displays a single order as a tappable card in the order history list.
 * Shows order number, formatted date, total amount, and optionally
 * an item count and status badge when the API provides them.
 */
export function OrderHistoryCard({ order, status }: Props) {
  /* Hermes (React Native's JS engine) is stricter than V8 with date parsing.
     Guard against invalid or unexpected date formats from the API. */
  const itemCount = order.itemCount;
  const orderDate = new Date(order.orderDate);
  const formattedDate = formatDate(orderDate, 'MMM d, yyyy');

  const formattedTotal = formatCurrency(order.totalAmount);

  return (
    <Link
      href={`/orders/${order.id}`}
      push
      asChild
    >
      <Pressable android_ripple={{ color: 'rgba(0,0,0,0.05)' }}>
        {({ pressed }) => (
          <Card className={cn('gap-0 px-4 py-4', pressed && 'opacity-80')}>
            <View className='flex-row items-center justify-between'>
              {/* Left side: order info */}
              <View className='flex-1 gap-1'>
                <View className='flex-row items-center gap-2'>
                  <Text className='font-semibold text-base text-foreground'>Order #{order.id}</Text>
                  {status != null && (
                    <Badge variant={statusVariant(status)}>
                      <Text>{status}</Text>
                    </Badge>
                  )}
                </View>
                <Text className='text-muted-foreground text-sm'>
                  {formattedDate}
                  {itemCount != null && ` · ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                </Text>
              </View>

              {/* Right side: total + chevron */}
              <View className='flex-row items-center gap-2'>
                <Text className='font-semibold text-foreground text-base'>{formattedTotal}</Text>
                <ChevronRight
                  size={18}
                  className='text-muted-foreground'
                />
              </View>
            </View>
          </Card>
        )}
      </Pressable>
    </Link>
  );
}
