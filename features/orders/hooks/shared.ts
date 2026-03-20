export const orderQueryKeys = {
  orders: ['orders'],
  orderDetails: (orderId: number) => [...orderQueryKeys.orders, orderId],
};
