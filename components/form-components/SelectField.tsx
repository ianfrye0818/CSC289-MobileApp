import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import z from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Text } from '../ui/text';

interface SelectFieldProps<T extends z.ZodType<FieldValues>> extends React.ComponentProps<
  typeof Select
> {
  name: FieldPath<z.infer<T>>;
  label?: string;
  required: boolean;
  placeholder?: string;
  options: { label: string; value: string }[];
  triggerProps?: React.ComponentProps<typeof SelectTrigger>;
  contentProps?: React.ComponentProps<typeof SelectContent>;
  itemProps?: React.ComponentProps<typeof SelectItem>;
}

export function SelectField<T extends z.ZodType<FieldValues>>({
  name,
  label,
  required,
  options,
  triggerProps,
  contentProps,
  itemProps,
  placeholder = 'Select an option',
  ...props
}: SelectFieldProps<T>) {
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

          <Select
            {...props}
            value={(() => {
              const v = field.value;
              if (v == null) return undefined;
              const str = typeof v === 'object' && v !== null && 'value' in v ? v.value : v;
              return { value: str, label: options.find((o) => o.value === str)?.label ?? str };
            })()}
            onValueChange={(option) => field.onChange(option?.value)}
            onBlur={field.onBlur}
          >
            <SelectTrigger {...triggerProps}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent {...contentProps}>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  {...itemProps}
                />
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage message={fieldState.error?.message} />
        </View>
      )}
    />
  );
}
