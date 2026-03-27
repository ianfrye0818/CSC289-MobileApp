import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { MapPin, Pencil, Trash2 } from 'lucide-react-native';
import { Alert, Pressable, View } from 'react-native';
import { useDeleteAddressForCurrentCustomer } from '../../hooks/useDeleteAddressForCurrentCustomer';
import { AddressResponseDto } from '../../types';

type Props = {
  address: AddressResponseDto;
};

export function AddressRow({ address }: Props) {
  const router = useRouter();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressForCurrentCustomer();

  const handleEdit = () => {
    router.push(`/(public)/addresses/edit/${address.id}` as never);
  };

  const handleDelete = () => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(address) },
    ]);
  };

  return (
    <Pressable
      onLongPress={handleEdit}
      delayLongPress={400}
      className='active:bg-muted/50 rounded-lg px-1 py-3'
    >
      <View className='flex-row items-start justify-between gap-3'>
        <View className='flex-row items-start gap-3 flex-1'>
          <View className='mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
            <MapPin
              size={16}
              className='text-primary'
            />
          </View>

          <View className='flex-1 gap-0.5'>
            <Text className='text-sm font-medium text-foreground'>{address.line1}</Text>
            {address.line2 ? (
              <Text className='text-sm text-muted-foreground'>{address.line2}</Text>
            ) : null}
            <Text className='text-sm text-muted-foreground'>
              {address.city}, {address.state} {address.zipcode}
            </Text>
            {address.country ? (
              <Text className='text-xs text-muted-foreground'>{address.country}</Text>
            ) : null}
          </View>
        </View>

        <View className='flex-row items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onPress={handleEdit}
          >
            <Pencil
              size={15}
              className='text-muted-foreground'
            />
          </Button>

          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Trash2
              size={15}
              className='text-destructive'
            />
          </Button>
        </View>
      </View>
    </Pressable>
  );
}
