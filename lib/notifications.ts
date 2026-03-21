import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// This controls how notifications behave when the app is in the FOREGROUND
// Without this, foreground notifications are silently ignored
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: true, // show the list of notifications
    shouldShowBanner: true, // show the banner of the notification
    shouldPlaySound: true, // play the sound of the notification
    shouldSetBadge: false, // update if we want to update the badge count
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  // Push notifications won't work on simulators/emulators for most cases,
  // but Expo Go on Android emulator is the exception - this check is still good practice
  // to keep in for other platforms
  if (!Device.isDevice) {
    console.warn('Must use a physical device or Expo Go on Android emulator');
    return null;
  }

  // Android requires a notification channel to be set up
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Check to see if we already have permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If we don't have permission, request it
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If they deny permission - bail out
  if (finalStatus !== 'granted') {
    console.warn('Permission not granted for push notifications');
    return null;
  }

  // Get the Expo push token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    console.error('No project ID found');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}
