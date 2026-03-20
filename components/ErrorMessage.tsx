import { Text } from '@react-navigation/elements';

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className='text-red-500 text-sm'>{message}</Text>;
}
