export const customerQueryKeys = {
  customer: ['customers'],
  customerDetails: (customerId: number) => [...customerQueryKeys.customer, customerId],
};
