import { formResolver } from '@/components/form-components/form-resolver';
import { InputField } from '@/components/form-components/InputField';
import { SelectField } from '@/components/form-components/SelectField';
import { TextAreaField } from '@/components/form-components/TextAreaField';
import { Button } from '@/components/ui/button';
import useAppForm from '@/hooks/useAppForm';
import { FormProvider } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import z from 'zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type FormValues = z.infer<typeof schema>;
export default function HomeScreen() {
  const form = useAppForm<FormValues>({
    formName: 'HomeScreen',
    resolver: formResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ padding: 16 }}
      >
        <FormProvider {...form}>
          <View className='gap-4'>
            <InputField<typeof schema>
              name='name'
              label='Name'
              required
            />
            <TextAreaField<typeof schema>
              name='description'
              label='Description'
              required
            />
            <SelectField<typeof schema>
              name='status'
              label='Is Active'
              required
              options={[
                { label: 'Active', value: 'active' },
                { label: 'InActive', value: 'inactive' },
              ]}
            />
            <Button
              variant={'outline'}
              onPress={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </View>
        </FormProvider>
      </ScrollView>
    </SafeAreaView>
  );
}
