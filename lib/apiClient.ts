import { useAuthStore } from '@/features/auth/store';
import { type paths } from '@/types/types.generated';
import createClient from 'openapi-fetch';
import { env } from './env';

export const apiClient = createClient<paths>({
  baseUrl: env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
