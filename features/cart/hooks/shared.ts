export const cartQueryKeys = {
  cart: ['cart'],
  cartItems: (cartId: number) => [...cartQueryKeys.cart, cartId],
};
