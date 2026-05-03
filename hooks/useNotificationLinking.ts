import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

export function useNotificationLinking(isReady: boolean = false) {
  const handled = useRef(false);

  // Live listener — foreground / background tap, no change needed
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const url = res.notification.request.content.data?.url;
      if (url) Linking.openURL(url as string);
    });
    return () => sub.remove();
  }, []);

  // Cold start — wait until auth is settled, then run after the route guard
  // effect via setTimeout(0) so the guard's router.replace('/products') can't
  // clobber this navigation.
  useEffect(() => {
    if (!isReady || handled.current) return;

    const timer = setTimeout(() => {
      const res = Notifications.getLastNotificationResponse();
      const url = res?.notification?.request?.content?.data?.url;
      if (url && !handled.current) {
        handled.current = true;
        Linking.openURL(url as string);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isReady]);
}
