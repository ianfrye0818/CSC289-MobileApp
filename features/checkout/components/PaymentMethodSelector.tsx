import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { PaymentMethod, getPaymentLabel } from '@/types/PaymentMethod.enum';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, View } from 'react-native';
import { CheckoutFormValues } from '../checkout.schema';
import { CreditCardForm } from './CreditCardForm';

export function SelectPaymentCard() {
  const form = useFormContext<CheckoutFormValues>();

  const filteredPaymentMethods = Object.values(PaymentMethod).filter((method) => {
    if (Platform.OS === 'ios' && method === PaymentMethod.GOOGLE_PAY) return false;
    if (Platform.OS === 'android' && method === PaymentMethod.APPLE_PAY) return false;
    return true;
  });

  return (
    <Card className='gap-0 px-4 py-3'>
      <Text className='text-2xl font-bold text-foreground'>Payment Type</Text>
      <View className='pt-3 gap-1'>
        <Controller
          control={form.control}
          name='paymentMethod'
          render={({ field }) => (
            <View>
              <Select
                value={{ label: getPaymentLabel(field.value), value: field.value }}
                onValueChange={(option) => {
                  if (option?.value) field.onChange(option.value as PaymentMethod);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a payment method' />
                </SelectTrigger>
                <SelectContent>
                  {filteredPaymentMethods.map((method) => (
                    <SelectItem
                      key={method}
                      value={method}
                      label={getPaymentLabel(method)}
                    />
                  ))}
                </SelectContent>
              </Select>
              {field.value === 'CREDIT_CARD' && <CreditCardForm />}
            </View>
          )}
        />
      </View>
    </Card>
  );
}
