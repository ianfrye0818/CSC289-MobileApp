import { useAuthStore } from '@/features/auth/store';
import { type paths } from '@/types/types.generated';
import createClient from 'openapi-fetch';
import { env } from './env';

/**
 * Typed HTTP client generated from the OpenAPI schema.
 *
 * Uses `openapi-fetch` so every request/response is fully typed against the
 * backend's generated `paths` type — if the API changes and you regenerate
 * `types.generated.ts`, TypeScript will surface any mismatches at compile time.
 *
 * All API calls in the app should go through this client rather than raw fetch,
 * so that auth middleware (see below) is applied automatically.
 *
 * @example
 * const { data, error } = await apiClient.GET('/products', {});
 */
export const apiClient = createClient<paths>({
  baseUrl: env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Global middleware attached to `apiClient`.
 *
 * `onRequest` — Reads the JWT token from the Zustand auth store and injects it
 * as a Bearer token on every outgoing request. Note: we call `getState()` directly
 * (not a hook) because this runs outside of React's render cycle.
 *
 * `onResponse` — Watches for 401 Unauthorized responses. When the server rejects
 * our token (e.g. it expired), we automatically log the user out so they are
 * redirected to the login screen by the root layout guard.
 */
apiClient.use({
  // Automatically add the jwt token to the request headers
  onRequest({ request }) {
    const token = useAuthStore.getState().token;
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },

  // If the user is not authenticated, logout the user from the app
  onResponse({ response }) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    return response;
  },
});
