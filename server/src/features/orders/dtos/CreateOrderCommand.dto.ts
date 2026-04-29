import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from './PaymentMethod.dto';

export class CreateOrderCommandDto {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ enum: PaymentMethod, required: true })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  shippingAddressId: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  billingAddressId: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  shippingCost: number;
}