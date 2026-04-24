import { ErrorMessage } from '@/components/ErrorMessage';
import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import useAppForm from '@/hooks/useAppForm';
import React, { useRef } from 'react';
import { FormProvider, } from 'react-hook-form';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { z } from 'zod';
import { useUpdateCurrentCustomer } from '../hooks/useUpdateCurrentCustomer';
import { CustomerDetails } from '../types';

type Props = {
  customer: CustomerDetails;
  onSuccess?: () => void;
};

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional().default('555-555-5555'),
});

type FormValues = z.infer<typeof schema>;

export default function UpdateCustomerForm({ customer, onSuccess }: Props) {
  const { mutate: updateCustomer, isPending, error } = useUpdateCurrentCustomer();
  const form = useAppForm<FormValues>({
    formName: 'UpdateCustomerForm',
    resolver: formResolver(schema),
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone ?? '',
    },
  });

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const isLoading = form.formState.isSubmitting || isPending;

  const onSubmit = async (data: FormValues) => {
    updateCustomer(
      {
        original: customer,
        modified: data,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <FormProvider {...form}>
      <View className='flex-1 gap-6'>
        <View className='gap-1'>
          <Text className='text-xl font-semibold text-foreground'>Update Your Account Information</Text>
          <Text className='text-sm text-muted-foreground'>
            Edit your saved account details below.
          </Text>
        </View>

        <View className='gap-4'>
          <InputField<typeof schema>
            ref={firstNameRef}
            name='firstName'
            label='First Name'
            placeholder='John'
            required
            returnKeyType='next'
            autoCapitalize='words'
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />

          <InputField<typeof schema>
            ref={lastNameRef}
            name='lastName'
            label='Last Name'
            placeholder='Smith'
            required
            returnKeyType='next'
            autoCapitalize='words'
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <InputField<typeof schema>
            ref={phoneRef}
            name='phone'
            label='Phone Number'
            placeholder='555-555-5555'
            required
            type='number'
            maxLength={10}
            returnKeyType='done'
            />

          
        </View>

        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          size='lg'
          className='w-full mt-auto'
        >
          {isLoading ? <ActivityIndicator /> : 'Save Account Information'}
        </Button>
        <ErrorMessage message={error?.message} />
      </View>
    </FormProvider>
  );
}