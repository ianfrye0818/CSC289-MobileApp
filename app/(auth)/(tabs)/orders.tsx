import OrderHistoryScreen from "@/features/orders/components/OrderHistoryScreen";

/**
 * Orders tab route — thin wrapper that renders the OrderHistoryScreen
 * feature component. Follows the same pattern as the products tab.
 */
export default function AuthOrdersScreen() {
  return <OrderHistoryScreen />;
}
