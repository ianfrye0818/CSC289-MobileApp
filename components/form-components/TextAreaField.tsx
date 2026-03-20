import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { TextInputProps, View } from 'react-native';
import z from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../ui/label';
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';

export interface TextAreaFieldProps<T extends z.ZodType<FieldValues>> extends TextInputProps {
  name: FieldPath<z.infer<T>>;
  label?: string;
  description?: string;
  required: boolean;
  rows?: number;
}

export function TextAreaField<T extends z.ZodType<FieldValues>>({
  label,
  name,
  description,
  required,
  numberOfLines = 4,
  ...props
}: TextAreaFieldProps<T>) {
  const form = useFormContext<z.infer<T>>();
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <View className='w-full gap-2'>
          {label && (
            <View className='flex-row items-center gap-2'>
              <Label className='text-sm font-medium text-gray-700'>{label}</Label>
              {required && <Text className='text-xs text-red-500'>*</Text>}
            </View>
          )}
          <Textarea
            {...props}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            numberOfLines={numberOfLines}
          />
          {description && !fieldState.error && (
            <Text className='text-[#6B7280] text-sm'>{description}</Text>
          )}
          <ErrorMessage message={fieldState.error?.message} />
        </View>
      )}
    />
  );
}
