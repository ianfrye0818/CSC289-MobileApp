import { Stack } from "expo-router";

import { ElevateAppHeader } from "@/components/elevate-app-header";

export default function AuthLayout() {
  // Push notification registration moved to the root layout (via the
  // <NotificationRegistrar /> component) so the token dance starts before
  // auth completes; the mutation inside `useNotificationSetup` auth-gates
  // itself, so calling here too would just double-register.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          header: () => <ElevateAppHeader />,
        }}
      />
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

      <Stack.Screen
        name="cart/[id]"
        options={{
          headerShown: true,
          title: "Checkout",
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="addresses/index"
        options={{
          headerShown: true,
          title: "Addresses",
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="addresses/add/index"
        options={{
          headerShown: true,
          title: "Add Address",
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="account/[id]"
        options={{
          headerShown: true,
          title: "Edit Account",
          headerBackTitle: "Back",
        }}
      />
   
      <Stack.Screen
        name="addresses/edit/[id]"
        options={{
          headerShown: true,
          title: "Edit Address",
          headerBackTitle: "Back",
        }}
      />
    </Stack>

    
  );
}
