import { ValueOf } from './ValueOf';

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

export const getShippingCarrierLabel = (shippingCarrier: ShippingCarrier) => {
  switch (shippingCarrier) {
    case ShippingCarrier.DHL:
      return 'DHL';
    case ShippingCarrier.UPS:
      return 'UPS';
    case ShippingCarrier.FedEx:
      return 'FedEx';
    case ShippingCarrier.USPS:
      return 'USPS';
    case ShippingCarrier.DPD:
      return 'DPD';
    case ShippingCarrier.Royal_Mail:
      return 'Royal Mail';
    case ShippingCarrier.Hermes:
      return 'Hermes';
    case ShippingCarrier.DHL_Express:
      return 'DHL Express';
    case ShippingCarrier.UPS_Express:
      return 'UPS Express';
    case ShippingCarrier.FedEx_Express:
      return 'FedEx Express';
    case ShippingCarrier.USPS_Express:
      return 'USPS Express';
    case ShippingCarrier.DPD_Express:
      return 'DPD Express';
    default:
      return 'Unknown';
  }
};
