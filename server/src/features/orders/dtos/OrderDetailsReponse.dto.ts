import { ApiProperty } from '@nestjs/swagger';
import { OrderCustomerDto } from './OrderCustomer.dto';
import { PaymentStatus } from './PaytmentStatus.enum';
import { ShippingStatus } from './ShippingStatus.enum';

export class OrderDetailsResponseAddress {
  @ApiProperty({ type: Number, required: true, nullable: true })
  addressId: number | null;
  @ApiProperty({ type: String, required: false, nullable: true })
  line1: string | null;
  @ApiProperty({ type: String, required: true, nullable: true })
  line2: string | null;
  @ApiProperty({ type: String, required: true, nullable: true })
  city: string | null;
  @ApiProperty({ type: String, required: true, nullable: true })
  state: string | null;
  @ApiProperty({ type: String, required: true, nullable: true })
  zipCode: string | null;
  @ApiProperty({ type: String, required: true, nullable: true })
  country: string | null;
}

export class OrderDetailsResponseItem {
  @ApiProperty({ type: Number, required: true })
  id: number;
  @ApiProperty({ type: String, required: true })
  name: string;
  @ApiProperty({ type: Number, required: true })
  quantity: number;
  @ApiProperty({ type: Number, required: true })
  price: number;
  @ApiProperty({ type: Number, required: true, nullable: true })
  tax: number | null;
}

export class OrderDetailsResponsePayment {
  @ApiProperty({ type: Number, required: true })
  id: number;
  @ApiProperty({ type: String, required: true })
  method: string;
  @ApiProperty({ enum: PaymentStatus, required: true })
  status: PaymentStatus;
}

export class OrderDetailsResponseShippingDetails {
  @ApiProperty({ type: Number, required: true })
  id: number;
  @ApiProperty({ type: Number, required: true })
  cost: number;
  /**
   * ISO 8601 date strings. Changed from Date to string because
   * class-transformer serialises Date objects as `{}`.
   * — D3adMan, ticket #15
   */
  @ApiProperty({
    type: String,
    format: 'date-time',
    required: true,
    nullable: true,
  })
  shippedOn: string | null;
  @ApiProperty({
    type: String,
    format: 'date-time',
    required: true,
    nullable: true,
  })
  expectedBy: string | null;
  @ApiProperty({ enum: ShippingStatus, required: true })
  status: ShippingStatus;
  @ApiProperty({ type: String, required: true })
  carrier: string;
  @ApiProperty({ type: String, required: true })
  trackingNumber: string;
}

export class OrderDetailsResponseDiscount {
  @ApiProperty({ type: Number, required: true })
  id: number;
  @ApiProperty({ type: String, required: true })
  type: string;
  @ApiProperty({ type: Number, required: true })
  amount: number;
}

export class OrderDetailsResponseDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: OrderCustomerDto, required: true })
  customer: OrderCustomerDto;

  @ApiProperty({ type: OrderDetailsResponseAddress, required: true })
  shippingAddress: OrderDetailsResponseAddress;

  @ApiProperty({ type: OrderDetailsResponseAddress, required: true })
  billingAddress: OrderDetailsResponseAddress;

  @ApiProperty({ type: OrderDetailsResponseAddress, required: true })
  items: OrderDetailsResponseItem[];

  @ApiProperty({ type: OrderDetailsResponsePayment, required: true })
  payment: OrderDetailsResponsePayment;

  @ApiProperty({
    type: OrderDetailsResponseShippingDetails,
    required: true,
    nullable: true,
  })
  shipping: OrderDetailsResponseShippingDetails | null;

  @ApiProperty({ type: OrderDetailsResponseDiscount, required: true })
  discounts: OrderDetailsResponseDiscount[];

  /**
   * ISO 8601 date string. Changed from Date to string because
   * class-transformer serialises Date objects as `{}`.
   * — D3adMan, ticket #15
   */
  @ApiProperty({ type: String, format: 'date-time', required: true })
  orderDate: string;

  @ApiProperty({ type: Number, required: true })
  totalAmount: number;
}
