import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCheckout } from '@/features/orders/hooks/useCheckout';
import { useFormContext } from 'react-hook-form';
import { ActivityIndicator, View } from 'react-native';
import { CheckoutFormValues } from '../checkout.schema';

export function PurchaseButton() {
  const form = useFormContext<CheckoutFormValues>();
  const { mutate: checkout, isPending } = useCheckout();

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!values.shippingAddressId) {
      form.setError('shippingAddressId', { message: 'Shipping address is required' });
      return;
    }

    if (!values.billingAddressId) {
      form.setError('billingAddressId', { message: 'Billing address is required' });
      return;
    }

    checkout({
      shippingAddressId: values.shippingAddressId!,
      billingAddressId: values.billingAddressId!,
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
    <View className='px-4 py-3'>
      <Button
        disabled={isPending}
        onPress={form.handleSubmit(onSubmit)}
      >
        <Text>{isPending ? <ActivityIndicator /> : 'Purchase'}</Text>
      </Button>
    </View>
  );
}
