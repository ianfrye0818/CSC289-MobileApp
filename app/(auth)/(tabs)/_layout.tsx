import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useGetCartQty } from '@/features/cart/hooks/useGetCartQty';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const theme = Colors.light;
  const { data: cartQty } = useGetCartQty();
  const badge = cartQty && cartQty.qty > 0 ? cartQty.qty : undefined;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: { backgroundColor: theme.background },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name='products'
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name='bag.fill'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='cart'
        options={{
          title: 'Cart',
          tabBarBadge: badge,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name='cart.fill'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='orders'
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name='list.bullet'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='account'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name='person.fill'
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
