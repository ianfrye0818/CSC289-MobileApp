import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

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
    let token: Notifications.ExpoPushToken | null = null;
    if (Platform.OS === 'web') {
      return null;
    }
    if (!Device.isDevice && !__DEV__) {
      console.warn('ERROR: Must use a physical device');
      return null;
    }

    const { status: exisitingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = exisitingStatus;

    if (exisitingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return null;
    }

    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log('token', token);
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? undefined));

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      setResponse(response);
    });

    return () => {
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
