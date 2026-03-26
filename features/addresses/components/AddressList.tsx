import { DataWrapper } from '@/components/DataWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { MapPin, Pencil, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useDeleteAddressForCurrentCustomer } from '../hooks/useDeleteAddressForCurrentCustomer';
import { useGetCurrentCustomerAddresses } from '../hooks/useGetCurrentCustomerAddresses';
import { AddressListReponseDto } from '../types';
import UpdateAddressForm from './UpdateAddressForm';

type Props = {
  customerId: number;
};

function AddressRow({ address }: { address: AddressListReponseDto }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressForCurrentCustomer();

  const handleDelete = () => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAddress(address),
      },
    ]);
  };

  return (
    <Pressable
      onLongPress={() => setEditOpen(true)}
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
            onPress={() => setEditOpen(true)}
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

        <Dialog
          open={editOpen}
          onOpenChange={setEditOpen}
        >
          <DialogContent
            className='max-w-full'
            style={{ width: '100%' }}
          >
            <DialogHeader></DialogHeader>
            <UpdateAddressForm address={address} />
          </DialogContent>
        </Dialog>
      </View>
    </Pressable>
  );
}

export default function AddressList({ customerId }: Props) {
  const { data, isLoading, error } = useGetCurrentCustomerAddresses(customerId);

  return (
    <>
      <DataWrapper
        isLoading={isLoading}
        error={error}
        data={data}
      >
        {(addresses) => (
          <View className='overflow-hidden rounded-xl border border-border bg-card'>
            {addresses.length === 0 ? (
              <View className='items-center gap-2 py-10'>
                <MapPin
                  size={32}
                  className='text-muted-foreground'
                />
                <Text className='text-sm text-muted-foreground'>No saved addresses yet.</Text>
              </View>
            ) : (
              addresses.map((address, index) => (
                <View key={address.id}>
                  <View className='px-4 bg-purple-500'>
                    <AddressRow address={address} />
                  </View>
                  {index < addresses.length - 1 && <View className='h-px bg-border mx-4' />}
                </View>
              ))
            )}
          </View>
        )}
      </DataWrapper>
    </>
  );
}
