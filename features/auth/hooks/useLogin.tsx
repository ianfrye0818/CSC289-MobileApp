import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { useMutation } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuthStore } from '../store';
import { LoginUserPayload } from '../types';

// Returns the device push token only if permission is already granted — never
// prompts. The permission flow lives in usePushNotifications.
async function getGrantedPushToken(): Promise<string | null> {
  if (Platform.OS === 'web' || (!Device.isDevice && !__DEV__)) return null;
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return null;
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    return token.data ?? null;
  } catch {
    return null;
  }
}

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  return useMutation({
    mutationFn: async (payload: LoginUserPayload) => {
      const { accessToken } = await apiClient
        .POST('/api/auth/login', { body: payload })
        .then(unwrapResponse);
      await setToken(accessToken);
      const user = await apiClient.GET('/api/auth/me').then(unwrapResponse);
      return { token: accessToken, user };
    },
    onSuccess: async ({ user }) => {
      await Promise.all([setUser(user), setIsAuthenticated(true)]);
      // Guarantee registration on every login — JWT is in the store at this
      // point so the request goes out authenticated. useNotificationSetup
      // handles the ambient case but can lose the race with getExpoPushTokenAsync.
      const pushToken = await getGrantedPushToken();
      if (pushToken) {
        await apiClient
          .POST('/api/notifications/register-token', { body: { token: pushToken } })
          .catch(() => {});
      }
    },
    onError: (error) => {
      console.error(error);
      appToast.error(error.message);
    },
  });
};
