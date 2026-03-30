import { QueryClient } from '@tanstack/react-query';

/**
 * Shared React Query client used throughout the app.
 *
 * This single instance is passed to `<QueryClientProvider>` in the root layout
 * so that all hooks (`useQuery`, `useMutation`, etc.) share the same cache.
 *
 * **Default query options:**
 * - `retry: 1` — failed requests are retried once before surfacing an error.
 * - `staleTime / gcTime: 24 hours` — cached data is considered fresh for a full
 *   day and kept in memory for 24 hours. Good for product/catalog data that
 *   doesn't change often; override per-query if you need fresher data.
 * - All auto-refetch behaviours are disabled — data is only fetched on explicit
 *   request or cache miss, which is appropriate for a mobile app where background
 *   refetches would consume mobile data unnecessarily.
 *
 * **Default mutation options:**
 * - `retry: 1` — mutations (POST/PATCH/DELETE) are retried once on failure.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
