import { ValueOf } from '@/types/ValueOf';
import { pickRandom } from '@/utils/pickRandom';
import { faker } from '@faker-js/faker';

export const ShippingCarrier = {
  DHL: 'DHL',
  UPS: 'UPS',
  FedEx: 'FedEx',
  USPS: 'USPS',
  DPD: 'DPD',
  Royal_Mail: 'Royal_Mail',
  Hermes: 'Hermes',
  DHL_Express: 'DHL_Express',
  UPS_Express: 'UPS_Express',
  FedEx_Express: 'FedEx_Express',
  USPS_Express: 'USPS_Express',
  DPD_Express: 'DPD_Express',
} as const;

export type ShippingCarrier = ValueOf<typeof ShippingCarrier>;

export const getRandomShippingCarrier = (): ShippingCarrier => {
  return pickRandom(Object.values(ShippingCarrier));
};

export const getRandomTrackingNumber = (): string => {
  return faker.string.alphanumeric(18).toUpperCase();
};
