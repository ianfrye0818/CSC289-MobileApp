import { ActivityIndicator, Text, View } from 'react-native';
export interface DataWrapperProps<T> {
  children: React.ReactNode | ((data: T) => React.ReactNode);
  data?: T | null | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode | ((error: Error) => React.ReactNode);
  noDataComponent?: React.ReactNode;
}

export function DataWrapper<T>({
  children,
  isLoading,
  data,
  error,
  loadingComponent,
  errorComponent,
  noDataComponent,
}: DataWrapperProps<T>) {
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
          <View className=' flex-1 items-center justify-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-bold'>
            <Text>Error:</Text>
            <Text>{error.message}</Text>
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
