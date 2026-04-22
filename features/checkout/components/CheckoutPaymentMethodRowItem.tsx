import { cn } from '@/lib/utils';
import { PaymentMethod } from '@/types/PaymentMethod.enum';
import { Image, ImageSourcePropType, Pressable, Text } from 'react-native';

type Props = {
  paymentMethod: PaymentMethod;
  onPress: (paymentMethod: PaymentMethod) => void;
  isSelected: boolean;
  label: string;
  imageSource: ImageSourcePropType;
};

export function CheckoutPaymentMethodRowItem({
  paymentMethod,
  onPress,
  isSelected,
  imageSource,
  label,
}: Props) {
  return (
    <Pressable
      className={cn('px-2 py-1 rounded-md flex-row items-center gap-2', isSelected && 'bg-accent')}
      onPress={() => onPress(paymentMethod)}
    >
      <Image
        source={imageSource}
        className='w-10 h-10 rounded-md'
        resizeMode='contain'
      />
      <Text>{label}</Text>
    </Pressable>
  );
}
