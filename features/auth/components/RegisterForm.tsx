import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { Button } from '@/components/ui/button';
import useAppForm from '@/hooks/useAppForm';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import z from 'zod';
import { useRegister } from '../hooks/useRegister';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be less than 20 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be less than 20 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { mutate: register, isPending, error } = useRegister();

  const form = useAppForm<RegisterSchema>({
    formName: 'RegisterForm',
    resolver: formResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isLoading = form.formState.isSubmitting || isPending;

  const onSubmit = async (data: RegisterSchema) => {
    const { confirmPassword, ...payload } = data;
    register(payload, {
      onSuccess: () => {
        form.reset();
        router.replace('/products');
      },
    });
  };
  return (
    <FormProvider {...form}>
      <View className='gap-4 w-full'>
        <Text className='text-2xl font-bold text-center'>Register</Text>
        <InputField<typeof registerSchema>
          name='firstName'
          label='First Name'
          placeholder='John'
          required
        />
        <InputField<typeof registerSchema>
          name='lastName'
          label='Last Name'
          placeholder='Doe'
          required
        />
        <InputField<typeof registerSchema>
          name='email'
          label='Email'
          placeholder='john.doe@example.com'
          required
        />
        <InputField<typeof registerSchema>
          name='phone'
          label='Phone'
          placeholder='123-456-7890'
          required
        />
        <InputField<typeof registerSchema>
          name='password'
          label='Password'
          type='password'
          placeholder='********'
          required
        />
        <InputField<typeof registerSchema>
          name='confirmPassword'
          type='password'
          label='Confirm Password'
          placeholder='********'
          required
        />
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          size='lg'
          className='w-full mt-auto'
        >
          {isLoading ? <ActivityIndicator /> : 'Register'}
        </Button>
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm text-gray-500'>Already have an account?</Text>
          <Link
            href='/login'
            replace
            className='text-sm text-primary'
          >
            Login
          </Link>
        </View>
      </View>
    </FormProvider>
  );
}
