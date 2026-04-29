import { useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { Button } from './ui/button';
export interface DataWrapperProps<T> {
  children: React.ReactNode | ((data: T) => React.ReactNode);
  data?: T | null | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode | ((error: Error) => React.ReactNode);
  noDataComponent?: React.ReactNode;
  refetch?: () => void;
}

export function DataWrapper<T>({
  children,
  isLoading,
  data,
  error,
  loadingComponent,
  errorComponent,
  noDataComponent,
  refetch,
}: DataWrapperProps<T>) {
  const router = useRouter();
  if (isLoading) {
    return (
      loadingComponent || (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator />
        </View>
      )
    );
  }

  if (error) {
    return typeof errorComponent === 'function'
      ? errorComponent(error)
      : errorComponent || (
          <View className='flex-1 items-center justify-center gap-4 px-4'>
            <View className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-bold'>
              <Text>Error:</Text>
              <Text>{error.message}</Text>
            </View>
            <View className='flex-row gap-2'>
              {router.canGoBack() && (
                <Button
                  variant={'outline'}
                  className='flex-1'
                  onPress={() => router.back()}
                >
                  Go Back
                </Button>
              )}

              <Button
                className='flex-1'
                onPress={refetch}
              >
                Retry
              </Button>
            </View>
          </View>
        );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      noDataComponent || (
        <View className='flex-1 items-center justify-center text-gray-500 text-center p-8'>
          <Text>No data available</Text>
        </View>
      )
    );
  }

  // Data exists - children can safely access it without null checks
  return typeof children === 'function' ? children(data) : children;
}
