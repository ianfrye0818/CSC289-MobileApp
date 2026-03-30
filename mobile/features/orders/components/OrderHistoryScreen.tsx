import { DataWrapper } from "@/components/DataWrapper";
import { Text } from "@/components/ui/text";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { styled } from "nativewind";
import { FlatList, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { OrderListItem } from "../types";
import NoOrdersAvailable from "./NoOrdersAvailable";
import { OrderHistoryCard } from "./OrderHistoryCard";

const SafeAreaView = styled(RNSafeAreaView);

/**
 * Order History screen (ticket #14).
 * Displays the current user's orders in reverse chronological order.
 * Supports pull-to-refresh for re-fetching the order list.
 */
export default function OrderHistoryScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useOrders();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* DataWrapper handles loading spinner, error display, and empty state.
          Render function receives typed data only after all checks pass. */}
      <DataWrapper
        data={data}
        isLoading={isLoading}
        error={error}
        noDataComponent={<NoOrdersAvailable />}
      >
        {(orders: OrderListItem[]) => (
          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={({ item }) => <OrderHistoryCard order={item} />}
            /* Pull-to-refresh: swipe down to re-fetch order list */
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View className="mb-1">
                <Text className="text-2xl font-bold text-foreground">
                  Order History
                </Text>
              </View>
            }
            /* Fallback if DataWrapper passes data but it filters to empty */
            ListEmptyComponent={<NoOrdersAvailable />}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}
