import { DataWrapper } from "@/components/DataWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { useGetCurrentCustomerAddresses } from "@/features/addresses/hooks/useGetCurrentCustomerAddresses";
import { AddressResponseDto } from "@/features/addresses/types";
import { ProductHorizontalList } from "@/features/products/components/ProductHorizontalList";
import { ProductListItem } from "@/features/products/types";
import { TAX_RATE } from "@/server/src/constants";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../hooks/useCart";
import { CartItem, ShoppingCart } from "../types";

export function CheckoutDetails({ cart }: { cart: ShoppingCart }) {
  const { data, isLoading, error } = useCart();
  const cartItems = data?.items ?? [];
  const totalPrice = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const taxAmount = totalPrice * TAX_RATE;
  const finalAmount = totalPrice + taxAmount;
  const { data: addresses } = useGetCurrentCustomerAddresses();
  const [selectedAddress, setSelectedAddress] = useState<AddressResponseDto | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const paymentTypes = ["Credit Card", Platform.OS === "ios" ? "Apple Pay" : "Google Pay", "PayPal"];

  const formatAddress = (address: AddressResponseDto | null): string => {
    const parts = [
      address?.line1,
      address?.line2,
      [address?.city, address?.state, address?.zipcode].filter(Boolean).join(", "),
      address?.country,
    ].filter(Boolean);
  
    return parts.length > 0 ? parts.join("\n") : "No address on file";
  };
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

        {/* Shipping address */}
        <Card className="gap-0 px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Shipping Address</Text>
          <View className="gap-1">
            <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Shipping
            </Text>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <View className="min-h-12 bg-muted rounded px-3 py-3">
                  <Text className="text-foreground text-sm">
                    {formatAddress(selectedAddress)}
                  </Text>
                </View>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedAddress?.id.toString()}
                  onValueChange={(value) => {
                    const addr = addresses?.find(a => a.id.toString() === value);
                    setSelectedAddress(addr ?? null);
                  }}
                >
                  {addresses?.map((addr) => (
                    <DropdownMenuRadioItem key={addr.id} value={addr.id.toString()}>
                      <Text className="text-foreground text-sm">
                        {formatAddress(addr)}
                      </Text>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </Card>
        
        {/* Payment methods */}
        <Card className="gap-0 px-4 py-3">
          <Text className="text-2xl font-bold text-foreground">Payment Type</Text>
          <View className="pt-3 gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <View className="h-12 bg-muted rounded px-3 justify-center">
                  <Text className="text-foreground text-sm">
                    {selectedPayment || "Select payment method"}
                  </Text>
                </View>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                >
                  {paymentTypes.map((type) => (
                    <DropdownMenuRadioItem key={type} value={type}>
                      <Text className="text-foreground text-sm">{type}</Text>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </Card>
      </ScrollView>
      {/* Purchase button */}
        <PurchaseButton
          disabled={!selectedAddress || !selectedPayment}
          onPress={() => {
            // Implement purchase logic here
          }}
        />
    </SafeAreaView>
  );
}

function PurchaseButton({
  disabled,
  onPress,
}: {
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <View className="px-4 py-3">
      <Button
        disabled={disabled}
        onPress={onPress}
      >
        Purchase
      </Button>
    </View>
  );
}
