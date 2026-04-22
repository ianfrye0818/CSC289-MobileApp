import { PaymentMethod, getPaymentLabel } from '@/types/PaymentMethod.enum';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Platform, Text, View } from 'react-native';
import { CheckoutFormValues } from '../checkoutSchema';
import { CheckoutCreditCardForm } from './CheckoutCreditCardForm';
import { CheckoutPaymentMethodRowItem } from './CheckoutPaymentMethodRowItem';

export function CheckoutPaymentMethodRow() {
  const form = useFormContext<CheckoutFormValues>();
  const paymentMethod = useWatch({ control: form.control, name: 'paymentMethod' });
  const isCreditCard = paymentMethod === PaymentMethod.CREDIT_CARD;

  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    form.setValue('paymentMethod', paymentMethod);
  };

  const APPLE_PAY_IMAGE = require('@/assets/images/apple_pay.png');
  const GOOGLE_PAY_IMAGE = require('@/assets/images/google_pay.png');
  const CREDIT_CARD_IMAGE = require('@/assets/images/credit_card_icon.png');

  return (
    <View className='py-2 border-b border-border gap-2'>
      <Text className='text-md font-semibold text-foreground'>
        Payment Method {getPaymentLabel(paymentMethod)}
      </Text>
      <View className='gap-2'>
        {Platform.OS === 'ios' && (
          <CheckoutPaymentMethodRowItem
            paymentMethod={PaymentMethod.APPLE_PAY}
            onPress={setPaymentMethod}
            isSelected={paymentMethod === PaymentMethod.APPLE_PAY}
            imageSource={APPLE_PAY_IMAGE}
            label={getPaymentLabel(PaymentMethod.APPLE_PAY)}
          />
        )}
        {Platform.OS === 'android' && (
          <CheckoutPaymentMethodRowItem
            paymentMethod={PaymentMethod.GOOGLE_PAY}
            onPress={setPaymentMethod}
            isSelected={paymentMethod === PaymentMethod.GOOGLE_PAY}
            imageSource={GOOGLE_PAY_IMAGE}
            label={getPaymentLabel(PaymentMethod.GOOGLE_PAY)}
          />
        )}
        <CheckoutPaymentMethodRowItem
          paymentMethod={PaymentMethod.CREDIT_CARD}
          onPress={setPaymentMethod}
          isSelected={paymentMethod === PaymentMethod.CREDIT_CARD}
          imageSource={CREDIT_CARD_IMAGE}
          label={getPaymentLabel(PaymentMethod.CREDIT_CARD)}
        />
        {isCreditCard && <CheckoutCreditCardForm />}
      </View>
    </View>
  );
}
