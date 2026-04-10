import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Set once at module level to avoid re-registering on every render
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
    shouldShowBanner: true,
  }),
});

export interface PushNotificationState {
  notification?: Notifications.Notification;
  response?: Notifications.NotificationResponse;
  expoPushToken?: Notifications.ExpoPushToken;
}

async function registerForPushNotificationsAsync(): Promise<Notifications.ExpoPushToken | null> {
  if (!Device.isDevice && !__DEV__) {
    console.warn('ERROR: Must use a physical device.');
    return null;
  }

  // Set up Android channel BEFORE requesting token
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notifications!');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  return token;
}

export const usePushNotifications = (): PushNotificationState => {
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [response, setResponse] = useState<
    Notifications.NotificationResponse | undefined
  >(undefined);
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token ?? undefined),
    );

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
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
