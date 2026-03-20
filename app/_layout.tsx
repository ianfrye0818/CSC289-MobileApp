import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { FullWindowOverlay } from 'react-native-screens';
import '../global.css';

import { toastConfig } from '@/components/ToastConfig';
import { useColorScheme } from '@/hooks/use-color-scheme';

const Overlay = Platform.OS === 'ios' ? FullWindowOverlay : ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='modal'
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style='auto' />
      <Toast config={toastConfig} />
      <Overlay>
        <PortalHost />
      </Overlay>
    </ThemeProvider>
  );
}
