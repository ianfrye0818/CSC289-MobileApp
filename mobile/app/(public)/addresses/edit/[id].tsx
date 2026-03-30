import { DataWrapper } from '@/components/DataWrapper';
import UpdateAddressForm from '@/features/addresses/components/UpdateAddressForm';
import { useGetCurrentCustomerAddressById } from '@/features/addresses/hooks/useGetCurrentCustomerAddressById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function EditAddressScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useGetCurrentCustomerAddressById(Number(id));
  const router = useRouter();

  return (
    <DataWrapper
      data={data}
      isLoading={isLoading}
      error={error}
    >
      {(address) => (
        <View className='flex-1 bg-background px-4 py-10'>
          <UpdateAddressForm
            address={address}
            onSuccess={() => router.back()}
          />
        </View>
      )}
    </DataWrapper>
  );
}
