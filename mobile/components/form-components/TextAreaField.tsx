import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { TextInputProps, View } from 'react-native';
import z from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../ui/label';
import { Text } from '../ui/text';
import { Textarea } from '../ui/textarea';

/**
 * Props for {@link TextAreaField}.
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 */
export interface TextAreaFieldProps<T extends z.ZodType<FieldValues>> extends TextInputProps {
  /** The field name — must match a key in your Zod schema. */
  name: FieldPath<z.infer<T>>;
  /** Optional label rendered above the textarea. */
  label?: string;
  /** Helper text shown below the textarea when there is no error. */
  description?: string;
  /** When `true`, renders a red asterisk next to the label. */
  required: boolean;
  /** Number of visible text rows (maps to `numberOfLines` on the native input). */
  rows?: number;
}

/**
 * A controlled multi-line text input connected to a React Hook Form context.
 *
 * Must be rendered inside a `<FormProvider>`. Behaves like {@link InputField}
 * but uses the `<Textarea>` primitive and supports multi-line input.
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 *
 * @example
 * <TextAreaField<typeof schema>
 *   name="notes"
 *   label="Order Notes"
 *   required={false}
 *   rows={6}
 * />
 */
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
