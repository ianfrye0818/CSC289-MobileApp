import { DataWrapper } from "@/components/DataWrapper";
import { Text } from "@/components/ui/text";
import { FlatList, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from "../hooks/useCart";
import { CartItem } from "../types";
import { CartCard } from "./CartCard";
import NoCartItemsAvailable from "./NoCartItemsAvailable";

export default function CartOverviewScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useCart();

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <DataWrapper
        data={data?.items}
        isLoading={isLoading}
        error={error}
        noDataComponent={<NoCartItemsAvailable />}
      >
        {(cartItems: CartItem[]) => (
          <FlatList
              data={cartItems}
              keyExtractor={(item) => String(item.product.productId)}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              renderItem={({ item }) => <CartCard cartItem={item} />}
              refreshing={isRefetching}
              onRefresh={refetch}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View className='mb-1'>
                  <Text className="text-2xl font-bold text-foreground">
                    Items
                  </Text>
                </View>
              }
              ListEmptyComponent={<NoCartItemsAvailable />}
          />
        )}
      </DataWrapper>
    </SafeAreaView>
  );
}