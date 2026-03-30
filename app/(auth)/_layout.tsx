import { Stack } from "expo-router";
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="products/[id]"
        options={{
          headerShown: true,
          title: "Product Information",
          headerBackTitle: "Back",
        }}
      />
      {/* Order detail screen — shows native header with back button */}
      <Stack.Screen
        name="orders/[id]"
        options={{
          headerShown: true,
          title: "Order Details",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
