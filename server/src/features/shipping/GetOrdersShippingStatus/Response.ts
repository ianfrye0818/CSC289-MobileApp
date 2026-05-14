import { ShippingCarrier } from '@/features/orders/dtos/ShippingCarrier.enum';
import { ShippingStatus } from '@/features/orders/dtos/ShippingStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ShippingAddress {
  @ApiProperty({ type: Number, required: true })
  addressId: number;

  @ApiProperty({ type: String, required: true })
  line1: string;

  @ApiProperty({ type: String, required: true, nullable: true })
  line2: string | null;

  @ApiProperty({ type: String, required: true })
  city: string;

  @ApiProperty({ type: String, required: true })
  state: string;

  @ApiProperty({ type: String, required: true })
  zipCode: string;

  @ApiProperty({ type: String, required: true })
  country: string;
}

export class GetOrdersShippingStatusResponse {
  @ApiProperty({ type: Number, required: true })
  shippingId: number;

  @ApiProperty({ type: Number, required: true })
  orderId: number;

  @ApiProperty({ enum: ShippingStatus, required: true })
  status: ShippingStatus;

  @ApiProperty({ type: Number, required: true })
  cost: number;

  @ApiProperty({ type: Date, required: true, nullable: true })
  shippedOn: Date | null;

  @ApiProperty({ enum: ShippingCarrier, required: true })
  carrier: ShippingCarrier;

  @ApiProperty({ type: String, required: true })
  trackingNumber: string;

  @ApiProperty({ type: Date, required: true, nullable: true })
  expectedBy: Date | null;

  @ApiProperty({ type: ShippingAddress, required: true })
  billingAddress: ShippingAddress;

  @ApiProperty({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @ApiProperty({ type: String, required: true, nullable: true })
  notes: string | null;
}
