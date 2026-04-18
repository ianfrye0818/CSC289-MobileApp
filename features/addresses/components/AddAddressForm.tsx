import { ErrorMessage } from '@/components/ErrorMessage';
import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Text } from '@/components/ui/text';
import useAppForm from '@/hooks/useAppForm';
import { US_STATES } from '@/lib/usSates';
import React, { useRef } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { z } from 'zod';
import { useAddAddressToCurrentCustomer } from '../hooks/useAddAddressToCurrentCustomer';

const schema = z.object({
  line1: z.string().min(1, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(5, 'Invalid zipcode format').max(10, 'Invalid zipcode format'),
  country: z.string().optional().default('USA'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
};

export default function AddAddressForm({ onSuccess }: Props) {
  const { mutate: addAddress, isPending, error } = useAddAddressToCurrentCustomer();
  const form = useAppForm<FormValues>({
    formName: 'AddAddressForm',
    resolver: formResolver(schema),
    defaultValues: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'USA',
    },
  });

  const stateValue = useWatch({ control: form.control, name: 'state' });

  const line1Ref = useRef<TextInput>(null);
  const line2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);

  const isLoading = form.formState.isSubmitting || isPending;

  const onSubmit = async (data: FormValues) => {
    addAddress(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <FormProvider {...form}>
      <View className='gap-6 flex-1'>
        <View className='gap-1'>
          <Text className='text-xl font-semibold text-foreground'>Add Address</Text>
          <Text className='text-sm text-muted-foreground'>
            Enter your new address details below.
          </Text>
        </View>

        <View className='gap-4'>
          <InputField<typeof schema>
            ref={line1Ref}
            name='line1'
            label='Street Address'
            placeholder='123 Main St'
            required
            returnKeyType='next'
            autoCapitalize='words'
            onSubmitEditing={() => line2Ref.current?.focus()}
          />

          <InputField<typeof schema>
            ref={line2Ref}
            name='line2'
            label='Apt, Suite, Unit (optional)'
            placeholder='Apt 4B'
            required={false}
            returnKeyType='next'
            autoCapitalize='words'
            onSubmitEditing={() => cityRef.current?.focus()}
          />

          <InputField<typeof schema>
            ref={cityRef}
            name='city'
            label='City'
            placeholder='Raleigh'
            required
            returnKeyType='next'
            autoCapitalize='words'
            onSubmitEditing={() => zipRef.current?.focus()}
          />

          <View className='flex-row gap-3'>
            <View className='flex-1'>
              <Combobox
                label='State'
                items={US_STATES.map((s) => ({ label: s.label, value: s.value }))}
                placeholder='Select a state'
                onChange={(value) => form.setValue('state', value)}
                value={stateValue}
                multiple={false}
              />
            </View>

            <View className='flex-1'>
              <InputField<typeof schema>
                ref={zipRef}
                name='zipcode'
                label='ZIP Code'
                placeholder='27601'
                required
                type='number'
                maxLength={10}
                returnKeyType='done'
              />
            </View>
          </View>
        </View>
        <ErrorMessage message={error?.message} />
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          size='lg'
          className='w-full mt-auto'
        >
          {isLoading ? <ActivityIndicator /> : 'Save Address'}
        </Button>
      </View>
    </FormProvider>
  );
}
