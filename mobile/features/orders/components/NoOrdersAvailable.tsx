import { ClipboardList } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

/**
 * Empty state displayed when the user has no order history.
 * Used by DataWrapper's noDataComponent prop in OrderHistoryScreen.
 */
export default function NoOrdersAvailable() {
  return (
    <View className="flex-1 items-center justify-center gap-3 p-8">
      <ClipboardList size={48} className="text-muted-foreground" />
      <Text className="text-muted-foreground text-center text-base">
        No orders yet
      </Text>
      <Text className="text-muted-foreground text-center text-sm">
        Your order history will appear here after your first purchase.
      </Text>
    </View>
  );
}
