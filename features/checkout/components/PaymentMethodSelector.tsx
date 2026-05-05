import { Card } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Text } from '@/components/ui/text';
import { PaymentMethod, getPaymentLabel } from '@/types/PaymentMethod.enum';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, View } from 'react-native';
import { CheckoutFormValues } from '../checkout.schema';
import { CreditCardForm } from './CreditCardForm';

export function PaymentMethodSelector() {
  const form = useFormContext<CheckoutFormValues>();

  const filteredPaymentMethods = Object.values(PaymentMethod).filter((method) => {
    if (Platform.OS === 'ios' && method === PaymentMethod.GOOGLE_PAY) return false;
    if (Platform.OS === 'android' && method === PaymentMethod.APPLE_PAY) return false;
    return true;
  });

  const items = filteredPaymentMethods.map((method) => ({
    label: getPaymentLabel(method),
    value: method,
  }));

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground'>Payment Type</Text>
      <View className='pt-3 gap-1'>
        <Controller
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <View>
              <Combobox<PaymentMethod>
                items={items}
                placeholder='Select a payment method'
                searchPlaceholder='Search payment methods'
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if (value !== PaymentMethod.CREDIT_CARD) {
                    form.setValue('creditCard', undefined);
                  }
                }}
                multiple={false}
              />
              {field.value === 'CREDIT_CARD' && <CreditCardForm />}
            </View>
          )}
        />
      </View>
    </Card>
  );
}
