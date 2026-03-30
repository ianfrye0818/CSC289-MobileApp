import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { OrderAddress, OrderDetails } from "../types";
import { OrderLineItem } from "./OrderLineItem";

/**
 * Maps a status string to a Badge variant for visual differentiation.
 * Used for both payment and shipping status badges.
 */
const statusVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "DELIVERED":
      return "success" as const;
    case "CANCELLED":
    case "FAILED":
      return "destructive" as const;
    case "PROCESSING":
    case "SHIPPED":
      return "default" as const;
    case "PENDING":
    default:
      return "secondary" as const;
  }
};

/**
 * Formats an address object into a readable multi-line string.
 * Handles nullable fields gracefully, omitting empty lines.
 */
const formatAddress = (address: OrderAddress): string => {
  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state, address.zipCode].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join("\n") : "No address on file";
};

interface Props {
  order: OrderDetails;
}

/**
 * Order Detail screen content (ticket #15).
 * Displays line items, payment and shipping status, addresses,
 * discounts, and order totals for a single order.
 *
 * Rendered inside a DataWrapper by the route at app/(auth)/orders/[id].
 */
export default function OrderDetailScreen({ order }: Props) {
  const formattedDate = new Date(order.orderDate);
  const dateString = isNaN(formattedDate.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(formattedDate);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(order.totalAmount);

  /* Calculate subtotal and tax from line items */
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalTax = order.items.reduce((sum, item) => sum + (item.tax ?? 0), 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Order header */}
      <View className="gap-1">
        <Text className="text-2xl font-bold text-foreground">
          Order #{order.id}
        </Text>
        <Text className="text-muted-foreground text-sm">{dateString}</Text>
      </View>

      {/* Line items */}
      <Card className="gap-0 px-4 py-3">
        <Text className="font-semibold text-base text-foreground mb-2">
          Items
        </Text>
        {order.items.map((item) => (
          <OrderLineItem key={item.id} item={item} />
        ))}

        {/* Totals */}
        <View className="pt-3 gap-1">
          <View className="flex-row justify-between">
            <Text className="text-muted-foreground text-sm">Subtotal</Text>
            <Text className="text-foreground text-sm">
              {formatCurrency(subtotal)}
            </Text>
          </View>
          {totalTax > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Tax</Text>
              <Text className="text-foreground text-sm">
                {formatCurrency(totalTax)}
              </Text>
            </View>
          )}
          {order.shipping?.cost != null && order.shipping.cost > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Shipping</Text>
              <Text className="text-foreground text-sm">
                {formatCurrency(order.shipping.cost)}
              </Text>
            </View>
          )}
          {/* Discounts */}
          {order.discounts.length > 0 &&
            order.discounts.map((discount) => (
              <View key={discount.id} className="flex-row justify-between">
                <Text className="text-muted-foreground text-sm">
                  Discount ({discount.type})
                </Text>
                <Text className="text-green-600 text-sm">
                  -{formatCurrency(discount.amount)}
                </Text>
              </View>
            ))}
          <View className="flex-row justify-between pt-2 border-t border-border mt-1">
            <Text className="font-bold text-foreground">Total</Text>
            <Text className="font-bold text-foreground">{formattedTotal}</Text>
          </View>
        </View>
      </Card>

      {/* Payment */}
      <Card className="gap-0 px-4 py-3">
        <Text className="font-semibold text-base text-foreground mb-2">
          Payment
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">Method</Text>
            <Text className="text-foreground text-sm">
              {order.payment.method || "N/A"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">Status</Text>
            <Badge variant={statusVariant(order.payment.status)}>
              <Text>{order.payment.status}</Text>
            </Badge>
          </View>
        </View>
      </Card>

      {/* Shipping — only shown if shipping data exists */}
      {order.shipping && (
        <Card className="gap-0 px-4 py-3">
          <Text className="font-semibold text-base text-foreground mb-2">
            Shipping
          </Text>
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Status</Text>
              <Badge variant={statusVariant(order.shipping.status)}>
                <Text>{order.shipping.status}</Text>
              </Badge>
            </View>
            {order.shipping.carrier && (
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">Carrier</Text>
                <Text className="text-foreground text-sm">
                  {order.shipping.carrier}
                </Text>
              </View>
            )}
            {order.shipping.trackingNumber && (
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">Tracking</Text>
                <Text className="text-foreground text-sm">
                  {order.shipping.trackingNumber}
                </Text>
              </View>
            )}
            {order.shipping.shippedOn && (
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">Shipped</Text>
                <Text className="text-foreground text-sm">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(order.shipping.shippedOn))}
                </Text>
              </View>
            )}
            {order.shipping.expectedBy && (
              <View className="flex-row items-center justify-between">
                <Text className="text-muted-foreground text-sm">
                  Expected by
                </Text>
                <Text className="text-foreground text-sm">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(order.shipping.expectedBy))}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}

      {/* Addresses */}
      <Card className="gap-0 px-4 py-3">
        <Text className="font-semibold text-base text-foreground mb-2">
          Addresses
        </Text>
        <View className="gap-4">
          {/* Shipping address */}
          <View className="gap-1">
            <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Shipping
            </Text>
            <Text className="text-foreground text-sm">
              {formatAddress(order.shippingAddress)}
            </Text>
          </View>
          {/* Billing address */}
          <View className="gap-1">
            <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Billing
            </Text>
            <Text className="text-foreground text-sm">
              {formatAddress(order.billingAddress)}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
