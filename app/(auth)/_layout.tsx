import { Stack } from 'expo-router';
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen
        name='products/[id]'
        options={{
          headerShown: true,
          title: 'Product Information',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen name='orders/[id]' />
    </Stack>
  );
}
