import { Controller, FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import { View } from 'react-native';
import z from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Text } from '../ui/text';

/**
 * Props for {@link SelectField}.
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 */
interface SelectFieldProps<T extends z.ZodType<FieldValues>> extends React.ComponentProps<
  typeof Select
> {
  /** The field name — must match a key in your Zod schema. */
  name: FieldPath<z.infer<T>>;
  /** Optional label rendered above the select. */
  label?: string;
  /** When `true`, renders a red asterisk next to the label. */
  required: boolean;
  /** Placeholder text shown when no option is selected. */
  placeholder?: string;
  /** The list of options to display in the dropdown. */
  options: { label: string; value: string }[];
  /** Extra props forwarded to the `<SelectTrigger>` element. */
  triggerProps?: React.ComponentProps<typeof SelectTrigger>;
  /** Extra props forwarded to the `<SelectContent>` element. */
  contentProps?: React.ComponentProps<typeof SelectContent>;
  /** Extra props forwarded to each `<SelectItem>` element. */
  itemProps?: React.ComponentProps<typeof SelectItem>;
}

/**
 * A controlled dropdown select connected to a React Hook Form context.
 *
 * Must be rendered inside a `<FormProvider>`. Handles the impedance mismatch
 * between React Hook Form (stores plain string values) and the rn-primitives
 * Select (which expects `{ value, label }` objects).
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 *
 * @example
 * <SelectField<typeof schema>
 *   name="category"
 *   label="Category"
 *   required
 *   options={[{ label: 'Electronics', value: 'electronics' }]}
 * />
 */
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
