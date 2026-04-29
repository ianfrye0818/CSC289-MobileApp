import { formatCurrency } from '@/lib/utils';
import { Text, View } from 'react-native';

type Props = {
  label: string;
  value: number;
};

export function SummaryCardRow({ label, value }: Props) {
  return (
    <View className='flex-row justify-between'>
      <Text className='text-lg font-medium text-foreground'>{label}</Text>
      <Text className='text-lg font-bold text-foreground'>{formatCurrency(value)}</Text>
    </View>
  );
}
