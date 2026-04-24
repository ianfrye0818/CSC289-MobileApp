import AnimatedSplash from '@/components/AnimatedSplash';
import { toastConfig } from '@/components/ToastConfig';
import { useAuthStore } from '@/features/auth/store';
import { useNotificationSetup } from '@/features/notifications/hooks/useNotificationSetup';
import { queryClient } from '@/lib/queryClient';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import '../global.css';

/**
 * Thin wrapper that calls `useNotificationSetup` inside the React Query
 * provider so `useRegisterPushToken` (a `useMutation` call) has a client to
 * attach to. Rendering `null` keeps the hook's effects but adds nothing to
 * the tree.
 */
function NotificationRegistrar() {
  useNotificationSetup();
  return null;
}

/**
 * Root layout — the single component that wraps every screen in the app.
 *
 * **Responsibilities:**
 * 1. Kick off auth initialization on mount so persisted credentials are loaded
 *    from SecureStore before any screen renders.
 * 2. Act as a route guard: redirect to `/login` if an unauthenticated user
 *    tries to access a protected `(auth)` route, and redirect to `home` if an
 *    authenticated user lands on a public route.
 * 3. Wrap the screen tree in `<QueryClientProvider>` so all React Query hooks
 *    share the same cache.
 *
 * **Route groups:**
 * - `(auth)` — protected screens; require a valid session.
 * - `(public)` — publicly accessible screens (login, browse, etc.).
 *
 * While auth is being restored from SecureStore (`isLoading === true`), a
 * full-screen spinner is shown so users never see a flash of the wrong screen.
 */
export default function RootLayout() {
  const initializeAuth = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const segments = useSegments();
  const [splashDone, setSplashDone] = useState(false);

  // Hydrate the auth store from SecureStore once on startup
  useEffect(() => {
    initializeAuth();
  }, []);

  // Route guard — runs whenever auth state or the current route changes
  useEffect(() => {
    if (isLoading) return; // Wait until we've read from SecureStore
    const inAuthGroup = (segments[0] as string) === '(auth)';
    const secondSegment = segments[1] as string | undefined;
    if (!isAuthenticated && inAuthGroup) {
      // User is not logged in but tried to access a protected screen
      router.replace('/login');
    } else if (
      !isAuthenticated &&
      !inAuthGroup &&
      segments[1] !== 'login' &&
      segments[1] !== 'register'
    ) {
      // User is not logged in and not on a public auth screen — send them to login
      router.replace('/login');
    } else if (isAuthenticated && !inAuthGroup) {
      // User is logged in but landed on a public screen (e.g. after deep link)
      router.replace('/products');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show a spinner while we wait for SecureStore to respond
  if (isLoading)
    return (
      <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            size='large'
            color='#0000ff'
          />
        </View>
        {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      </>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* Fires push-token registration early; self-gates on auth. */}
        <NotificationRegistrar />
        <Slot />
        {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
        <PortalHost />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
