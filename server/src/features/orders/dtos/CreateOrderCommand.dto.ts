import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from './PaymentMethod.enum';

export class CreateOrderCommandCreditCardDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  expiryMonth: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  expiryYear: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  cvc: string;
}

export class CreateOrderCommandDto {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  cartId: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  addressId: number;

  @ApiProperty({ enum: PaymentMethod, required: true })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: CreateOrderCommandCreditCardDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderCommandCreditCardDto)
  creditCard?: CreateOrderCommandCreditCardDto;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  shippingCost: number;
}
