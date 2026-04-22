import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressResponseDto } from '@/features/addresses/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { upperCase } from 'lodash';
import { Pressable, Text, View } from 'react-native';

type Props = {
  address: AddressResponseDto;
  selected: boolean;
  onSelect: (address: AddressResponseDto) => void;
  addressType: 'shipping' | 'billing';
};

export function CheckoutSelectedAddressAddressListRow({
  address,
  selected,
  onSelect,
  addressType,
}: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => onSelect(address)}
      className={cn(
        'p-2 rounded-lg active:bg-accent flex-row items-center gap-2',
        selected && 'bg-accent',
      )}
    >
      <Checkbox
        checked={selected}
        disabled={selected}
        onCheckedChange={() => onSelect(address)}
      />
      <View className='flex-1 gap-2 py-2'>
        <Text>
          {upperCase(address.line1)} {upperCase(address.line2)} {upperCase(address.city)},{' '}
          {upperCase(address.state)} {address.zipcode} {upperCase(address.country)}{' '}
        </Text>
        {selected && (
          <Button
            onPress={() =>
              router.dismissTo({
                pathname: '/checkout',
                params:
                  addressType === 'shipping'
                    ? { shippingAddressId: String(address.id) }
                    : { billingAddressId: String(address.id) },
              })
            }
          >
            {addressType === 'shipping' ? 'Deliver to this address' : 'Bill to this address'}
          </Button>
        )}
        <Button
          variant={'outline'}
          onPress={() => router.push(`/addresses/edit/${address.id}`)}
        >
          Edit
        </Button>
      </View>
    </Pressable>
  );
}
