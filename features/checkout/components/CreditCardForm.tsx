import { InputField } from '@/components/form-components/InputField';
import { View } from 'react-native';
import { checkoutSchema } from '../checkout.schema';

export function CreditCardForm() {
  return (
    <View className='py-2 my-4 border border-border rounded-md gap-2 px-2'>
      <InputField<typeof checkoutSchema>
        name='creditCard.cardholderName'
        label='Cardholder Name'
        required
      />
      <InputField<typeof checkoutSchema>
        name='creditCard.cardNumber'
        label='Card Number'
        maxLength={16}
        required
      />
      <View className='flex-row w-full gap-2'>
        <View className='min-w-0 flex-1'>
          <InputField<typeof checkoutSchema>
            name='creditCard.expiryMonth'
            label='Month'
            maxLength={2}
            type='number'
            required
          />
        </View>
        <View className='min-w-0 flex-1'>
          <InputField<typeof checkoutSchema>
            name='creditCard.expiryYear'
            label='Year'
            maxLength={4}
            type='number'
            required
          />
        </View>
      </View>
      <InputField<typeof checkoutSchema>
        name='creditCard.cvc'
        label='CVC'
        maxLength={3}
        type='number'
        required
      />
    </View>
  );
}
