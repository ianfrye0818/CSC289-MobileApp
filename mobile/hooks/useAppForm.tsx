import { FieldValues, useForm, UseFormProps } from 'react-hook-form';

/**
 * Extends the standard `useForm` props with a `formName` used for logging.
 *
 * @template TFieldValues - The shape of the form's data.
 * @template TContext - Optional context passed to the resolver.
 * @template TTransformedValues - Type after transformation (if using `transform`).
 */
interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
> extends UseFormProps<TFieldValues, TContext, TTransformedValues> {
  /** A human-readable name for this form, used as a prefix in console logs. */
  formName: string;
}

/**
 * Thin wrapper around React Hook Form's `useForm` that adds development-time
 * validation error logging.
 *
 * All form instances in the app should use this hook instead of `useForm`
 * directly. The logged output helps the whole team quickly spot which form has
 * errors without opening the React DevTools inspector.
 *
 * @template TFieldValues - The shape of the form's data (inferred from your Zod schema).
 * @template TContext - Optional resolver context.
 * @template TTransformedValues - Type after any value transformation.
 *
 * @param formName - Label prepended to console output, e.g. `'LoginForm'`.
 * @param props - All other options are forwarded directly to `useForm`.
 * @returns The standard React Hook Form `UseFormReturn` instance.
 *
 * @example
 * const form = useAppForm<typeof loginSchema>({
 *   formName: 'LoginForm',
 *   resolver: formResolver(loginSchema),
 *   defaultValues: { email: '', password: '' },
 * });
 */
export default function useAppForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>({ formName, ...props }: Props<TFieldValues, TContext, TTransformedValues>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>(props);

  if (Object.keys(form.formState.errors).length > 0) {
    console.log(`[${formName}]:[Form Errors]:`, form.formState.errors);
  }

  return form;
}
