import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { generateRandomNumber } from '@/lib/utils';
import { ActivityIndicator, View } from 'react-native';
import { useGetReviews } from '../hooks/useGetReviews';
import { Review } from '../types';

type Props = {
  productId: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <View className='flex-row gap-0.5'>
      {Array.from({ length: 5 }, (_, i) => (
        <Text
          key={i}
          className={i < rating ? 'text-yellow-400 text-sm' : 'text-muted-foreground/30 text-sm'}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.customer.value
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className='gap-0 py-4'>
      <CardContent className='gap-3'>
        <View className='flex-row items-center gap-3'>
          <Avatar
            alt={review.customer.value}
            className='size-9'
          >
            <AvatarFallback>
              <Text className='text-xs font-semibold text-muted-foreground'>{initials}</Text>
            </AvatarFallback>
          </Avatar>
          <View className='flex-1 gap-0.5'>
            <Text className='text-sm font-semibold leading-tight'>{review.customer.value}</Text>
            <StarRating rating={review.rating} />
          </View>
          <Text className='text-xs text-muted-foreground'>{review.rating}/5</Text>
        </View>

        {review.title ? (
          <Text className='text-sm font-semibold text-foreground'>{review.title}</Text>
        ) : null}

        <Text className='text-sm text-muted-foreground leading-relaxed'>{review.content}</Text>
      </CardContent>
    </Card>
  );
}

export function Reviews({ productId }: Props) {
  const limit = generateRandomNumber(1, 5);
  const { data, isLoading, error } = useGetReviews(productId, limit);

  return (
    <View className='gap-3'>
      <Text className='font-semibold text-base'>Reviews</Text>

      {isLoading && (
        <View className='items-center py-4'>
          <ActivityIndicator />
        </View>
      )}

      {error && !isLoading && (
        <Text className='text-sm text-muted-foreground'>Unable to load reviews.</Text>
      )}

      {!isLoading && !error && (!data || data.length === 0) && (
        <Text className='text-sm text-muted-foreground'>No reviews yet.</Text>
      )}

      {data &&
        data.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}
    </View>
  );
}
