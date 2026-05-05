import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

export interface PushNotificationState {
  notification?: Notifications.Notification;
  response?: Notifications.NotificationResponse;
  expoPushToken?: Notifications.ExpoPushToken;
}

// Module-scope: `setNotificationHandler` is a global config call, not per-hook state.
// Invoking it inside the hook body re-registered the handler on every render; doing
// it once at module load is what `expo-notifications` expects and matches Ian's
// `upstream/ianfrye/playground` direction.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
    shouldShowBanner: true,
  }),
});

export const usePushNotifications = (): PushNotificationState => {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );
  const [response, setResponse] = useState<Notifications.NotificationResponse | undefined>(
    undefined,
  );
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>(
    undefined,
  );

  async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | null> {
    if (Platform.OS === 'web') return null;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return null;

      // Set channel before fetching token — channel must exist on Android first
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'notifjingle',
        });
      }

      const projectId =
        Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) return null;

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      return token;
    } catch (err) {
      console.error('[PushNotif] getExpoPushTokenAsync failed:', err);
      return null;
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? undefined));

    // Re-check when the user returns from Android Settings after granting permission
    const appStateListener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        registerForPushNotificationsAsync().then((token) => {
          if (token) setExpoPushToken(token);
        });
      }
    });

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      setResponse(response);
    });

    return () => {
      appStateListener.remove();
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    notification,
    response,
    expoPushToken,
  };
};
