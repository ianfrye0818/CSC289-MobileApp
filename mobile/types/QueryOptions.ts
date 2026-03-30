import { type QueryOptions as TanstackQueryOptions } from '@tanstack/react-query';
export type QueryOptions<T> = Omit<TanstackQueryOptions<T>, 'queryKey' | 'queryFn'>;
