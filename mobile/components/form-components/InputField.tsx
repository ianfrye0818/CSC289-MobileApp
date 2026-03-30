import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { Pressable, View, type TextInputProps } from 'react-native';
import z from 'zod';
import { ErrorMessage } from '../ErrorMessage';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Text } from '../ui/text';

/**
 * Props for {@link InputField}.
 *
 * Extends all standard React Native `TextInputProps` except `secureTextEntry`
 * (which is managed internally based on the `type` prop).
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 */
export interface InputFieldProps<T extends z.ZodType<FieldValues>> extends Omit<
  TextInputProps,
  'secureTextEntry'
> {
  /** The field name — must match a key in your Zod schema. */
  name: FieldPath<z.infer<T>>;
  /** Optional label rendered above the input. */
  label?: string;
  /** Helper text shown below the input when there is no error. */
  description?: string;
  /** When `true`, renders a red asterisk next to the label. */
  required: boolean;
  /**
   * Semantic input type. Controls keyboard layout, auto-correct, auto-capitalise,
   * and whether the password visibility toggle is shown.
   * @default 'text'
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel';
}

/**
 * A controlled text input connected to a React Hook Form context.
 *
 * Must be rendered inside a `<FormProvider>` (or a component that calls
 * `useForm` and passes the instance to `<FormProvider>`). Reads and writes the
 * field value via `useFormContext` — no need to pass `control` manually.
 *
 * Handles validation error display, keyboard type selection, and (for
 * `type="password"`) a show/hide password toggle button.
 *
 * @template T - The Zod schema that describes the enclosing form's values.
 *
 * @example
 * <InputField<typeof loginSchema>
 *   name="email"
 *   label="Email"
 *   type="email"
 *   required
 * />
 */
export function InputField<T extends z.ZodType<FieldValues>>({
  name,
  label,
  description,
  required,
  type = 'text',
  ...props
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormContext<z.infer<T>>();

  const isPassword = type === 'password';

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View className='w-full gap-2'>
          {label && (
            <View className='flex-row items-center gap-2'>
              <Label className='text-sm font-medium text-gray-700'>{label}</Label>
              {required && <Text className='text-xs text-red-500'>*</Text>}
            </View>
          )}
          <View className='relative justify-center'>
            <Input
              {...props}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType={
                type === 'email'
                  ? 'email-address'
                  : type === 'number'
                    ? 'numeric'
                    : type === 'tel'
                      ? 'phone-pad'
                      : 'default'
              }
              autoCapitalize={type === 'email' ? 'none' : props.autoCapitalize}
              autoCorrect={type === 'email' || isPassword ? false : props.autoCorrect}
            />
            {isPassword && (
              <ShowPasswordButton
                showPassword={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            )}

            {description && !fieldState.error && (
              <Text className='text-[#6B7280] text-sm'>{description}</Text>
            )}
            <ErrorMessage message={fieldState.error?.message} />
          </View>
        </View>
      )}
    />
  );
}

/**
 * Small icon button that toggles password visibility for a password input.
 * Positioned absolutely inside the input wrapper so it overlaps the right edge.
 */
function ShowPasswordButton({
  showPassword,
  onToggle,
}: {
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8} // enlarges tap target without changing input
      className='absolute right-2 p-1'
    >
      {showPassword ? (
        <EyeOff
          size={16}
          color='#6b7280'
        />
      ) : (
        <Eye
          size={16}
          color='#6b7280'
        />
      )}
    </Pressable>
  );
}
