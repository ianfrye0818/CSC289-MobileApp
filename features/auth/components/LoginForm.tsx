import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { Button } from '@/components/ui/button';
import useAppForm from '@/hooks/useAppForm';
import { Link, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { FormProvider } from 'react-hook-form';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import z from 'zod';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters'),
});
type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const form = useAppForm<LoginSchema>({
    formName: 'LoginForm',
    resolver: formResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = form.formState.isSubmitting || isPending;

  const onSubmit = async (data: LoginSchema) => {
    login(data, {
      onSuccess: () => {
        form.reset();
        router.replace('/products');
      },
    });
  };
  return (
    <FormProvider {...form}>
      <View className='gap-4 w-full'>
        <Text className='text-2xl font-bold text-center'>Login</Text>
        <InputField<typeof loginSchema>
          ref={emailRef}
          name='email'
          type='email'
          label='Email'
          placeholder='john.doe@example.com'
          returnKeyType='next'
          onSubmitEditing={() => passwordRef.current?.focus()}
          required
        />
        <InputField<typeof loginSchema>
          ref={passwordRef}
          returnKeyLabel='done'
          name='password'
          type='password'
          label='Password'
          placeholder='********'
          required
        />
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          size='lg'
          className='w-full mt-auto'
        >
          {isLoading ? <ActivityIndicator /> : 'Login'}
        </Button>
        <View className='flex-row items-center gap-2'>
          <Text className='text-sm text-gray-500'>Don't have an account?</Text>
          <Link
            href={'/register'}
            replace
            className='text-sm text-primary'
          >
            Register
          </Link>
        </View>
      </View>
    </FormProvider>
  );
}
