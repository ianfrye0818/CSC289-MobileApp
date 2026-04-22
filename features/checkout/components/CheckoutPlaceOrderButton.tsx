import { Button } from '@/components/ui/button';
import { useCheckout } from '@/features/orders/hooks/useCheckout';
import { useFormContext } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import { CheckoutFormValues } from '../checkoutSchema';

export function CheckoutPlaceOrderButton() {
  const { mutate: checkout, isPending } = useCheckout();
  const form = useFormContext<CheckoutFormValues>();

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!values.addressId) {
      form.setError('addressId', { message: 'Address is required' });
      return;
    }
    checkout({
      addressId: values.addressId!,
      cartId: values.cartId,
      paymentMethod: values.paymentMethod,
      shippingCost: values.shippingCost,
      creditCard: values.creditCard
        ? {
            cardNumber: values.creditCard.cardNumber,
            expiryMonth: values.creditCard.expiryMonth,
            expiryYear: values.creditCard.expiryYear,
            cvc: Number(values.creditCard.cvc),
          }
        : undefined,
    });
  };

  return (
    <View className='border-b border-border py-2 gap-4'>
      <Text className='text-xs text-muted-foreground'>
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </Text>
      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? <ActivityIndicator /> : 'Place Order'}
      </Button>
    </View>
  );
}
