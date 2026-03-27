import { Stack } from 'expo-router';
export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='login' />
      <Stack.Screen name='products/index' />
      <Stack.Screen name='products/[id]' />
      <Stack.Screen
        name='addresses/index'
        options={{ title: 'Addresses', headerShown: true, headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name='addresses/edit/[id]'
        options={{ title: 'Edit Address', headerShown: true, headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name='addresses/add'
        options={{ title: 'Add Address', headerShown: true, headerBackTitle: 'Back' }}
      />
    </Stack>
  );
}
