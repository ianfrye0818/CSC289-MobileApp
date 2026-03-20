export const productQueryKeys = {
  products: ['products'],
  productDetails: (productId: number) => [...productQueryKeys.products, productId],
};
