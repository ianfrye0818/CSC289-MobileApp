import { Button } from '@/components/ui/button';
import { AddressResponseDto } from '@/features/addresses/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { CheckoutSelectedAddressAddressListRow } from './CheckoutSelectedAddressAddressListRow';

type Props = {
  addresses: AddressResponseDto[];
  localSelectedAddress: AddressResponseDto | null;
  setLocalSelectedAddress: (address: AddressResponseDto) => void;
  addressType: 'shipping' | 'billing';
};

export function CheckoutSelectAddressAddressList({
  addresses,
  localSelectedAddress,
  setLocalSelectedAddress,
  addressType,
}: Props) {
  const SLICE_SIZE = 3;
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const addressToShow = showAllAddresses ? addresses : addresses.slice(0, SLICE_SIZE);
  const router = useRouter();
  const canExpand = addresses.length > SLICE_SIZE;

  return (
    <View className='flex-1 py-6'>
      <View className='px-4'>
        <Text className='text-lg font-semibold'>All addresses ({addresses.length})</Text>
      </View>
      <FlatList
        className='flex-1'
        data={addressToShow}
        renderItem={({ item }) => (
          <CheckoutSelectedAddressAddressListRow
            address={item}
            selected={item.id === localSelectedAddress?.id}
            onSelect={setLocalSelectedAddress}
            addressType={addressType}
          />
        )}
        ItemSeparatorComponent={() => <View className='h-px bg-border my-4' />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
        ListFooterComponent={
          canExpand ? (
            <Pressable
              onPress={() => setShowAllAddresses(!showAllAddresses)}
              className='pt-2'
            >
              <Text className='text-md text-blue-500'>
                {showAllAddresses ? 'Show fewer addresses' : 'View more addresses'}
              </Text>
            </Pressable>
          ) : null
        }
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      />
      <View className='px-4 pt-2 gap-2'>
        <Button onPress={() => router.push('/addresses/add')}>Add Address</Button>

        <Text className='text-center text-sm text-muted-foreground py-2'>Or</Text>
        <Button
          variant={'outline'}
          onPress={() => router.back()}
        >
          Back to cart
        </Button>
      </View>
    </View>
  );
}
