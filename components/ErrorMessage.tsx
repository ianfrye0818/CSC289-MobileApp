import { Text } from '@react-navigation/elements';

/**
 * Displays a form field validation error message in red.
 *
 * Renders nothing when `message` is `undefined` or empty, so it is safe to
 * always include below an input — it only takes up space when there is actually
 * an error to show.
 *
 * Typically used inside form field components (`InputField`, `SelectField`,
 * `TextAreaField`) where the message comes from React Hook Form's `fieldState`.
 *
 * @param message - The error string to display, or `undefined` if no error.
 *
 * @example
 * <ErrorMessage message={fieldState.error?.message} />
 */
export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className='text-red-500 text-sm'>{message}</Text>;
}
