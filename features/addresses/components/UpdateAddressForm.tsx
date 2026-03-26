import { ErrorMessage } from '@/components/ErrorMessage';
import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { ComboboxField } from '@/components/form-components/ComboboxField';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAppForm from '@/hooks/useAppForm';
import { US_STATES } from '@/lib/usSates';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { z } from 'zod';
import { useUpdateAddressForCurrentCustomer } from '../hooks/useUpdateAddressForCurrentCustomer';
import { AddressListReponseDto } from '../types';

type Props = {
  address: AddressListReponseDto;
};

const schema = z.object({
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(5, 'Invalid zipcode format').max(10, 'Invalid zipcode format'),
  country: z.string().optional().default('USA'),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateAddressForm({ address }: Props) {
  const { mutate: updateAddress, isPending, error } = useUpdateAddressForCurrentCustomer();
  const form = useAppForm<FormValues>({
    formName: 'UpdateAddressForm',
    resolver: formResolver(schema),
    defaultValues: {
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country ?? 'USA',
    },
  });

  const isLoading = form.formState.isSubmitting || isPending;

  const onSubmit = async (data: FormValues) => {
    updateAddress(
      {
        original: address,
        modified: data,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <FormProvider {...form}>
      <View className='gap-6'>
        <View className='gap-1'>
          <Text className='text-xl font-semibold text-foreground'>Update Address</Text>
          <Text className='text-sm text-muted-foreground'>
            Edit your saved address details below.
          </Text>
        </View>

        <View className='gap-4'>
          <InputField<typeof schema>
            name='line1'
            label='Street Address'
            placeholder='123 Main St'
            required
            autoCapitalize='words'
          />

          <InputField<typeof schema>
            name='line2'
            label='Apt, Suite, Unit (optional)'
            placeholder='Apt 4B'
            required={false}
            autoCapitalize='words'
          />

          <InputField<typeof schema>
            name='city'
            label='City'
            placeholder='Raleigh'
            required
            autoCapitalize='words'
          />

          <View className='flex-row gap-3'>
            <View className='flex-1'>
              <ComboboxField<typeof schema>
                name='state'
                label='State'
                required
                placeholder='Select state'
                searchPlaceholder='Search states...'
                options={US_STATES}
              />
            </View>

            <View className='flex-1'>
              <InputField<typeof schema>
                name='zipcode'
                label='ZIP Code'
                placeholder='27601'
                required
                type='number'
                maxLength={10}
              />
            </View>
          </View>
        </View>

        <ErrorMessage message={error?.message} />

        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          size='lg'
          className='w-full'
        >
          {isLoading ? <ActivityIndicator /> : 'Save Address'}
        </Button>
      </View>
    </FormProvider>
  );
}
