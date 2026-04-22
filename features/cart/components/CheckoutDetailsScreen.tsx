import { DataWrapper } from "@/components/DataWrapper";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ProductHorizontalList } from "@/features/products/components/ProductHorizontalList";
import { ProductListItem } from "@/features/products/types";
import { TAX_RATE } from "@/server/src/constants";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../hooks/useCart";
import { CartItem, ShoppingCart } from "../types";

export function CheckoutDetails({ cart }: { cart: ShoppingCart }) {
  const { data, isLoading, error } = useCart();
  const cartItems = data?.items ?? [];
  const totalPrice = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const taxAmount = totalPrice * TAX_RATE;
  const finalAmount = totalPrice + taxAmount;
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <DataWrapper
          data={cartItems}
          isLoading={isLoading}
          error={error}
        >
          {(cartItems: CartItem[]) => {
            const cart = cartItems.map((item) => ({
              productId: item.product.productId,
              productName: item.product.productName,
              imageUrl: item.product.imageUrl,
              unitPrice: item.unitPrice,
            })) as ProductListItem[];
            return (
              <View className="gap-3">
                <Text className="text-2xl font-bold text-foreground">Cart</Text>
                <ProductHorizontalList products={cart} />
              </View>
            );
          }}
        </DataWrapper>
        {/* Summary card */}
        <Card className="gap-0 px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Summary</Text>
          <View className="pt-3 gap-1">
            <View className="flex-row justify-between">
              <Text className="text-lg font-medium text-foreground">Subtotal</Text>
              <Text className="text-lg font-bold text-foreground">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                  totalPrice,
                )}
              </Text>
            </View>
            {taxAmount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-lg font-medium text-foreground">Tax</Text>
                <Text className="text-lg font-bold text-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    taxAmount,
                  )}
                </Text>
              </View>
            )}
            {finalAmount > 0 && (
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-foreground">Total</Text>
                <Text className="text-lg font-bold text-foreground">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                    finalAmount,
                  )}
                </Text>
              </View>
            )}
          </View>
        </Card>
        
        {/* Payment methods */}
        <Card className="gap-0 px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Payment</Text>
          <View className="pt-3 gap-1">
            <Text className="text-lg font-medium text-foreground">Credit Card</Text>
            {/* Placeholder for credit card form */}
            <View className="h-12 bg-muted rounded" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
