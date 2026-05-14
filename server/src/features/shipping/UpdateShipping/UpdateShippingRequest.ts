import { ShippingCarrier } from '@/features/orders/dtos/ShippingCarrier.enum';
import { ShippingStatus } from '@/features/orders/dtos/ShippingStatus.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateShippingRequest {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ enum: ShippingStatus, required: false })
  @IsEnum(ShippingStatus)
  @IsOptional()
  status: ShippingStatus;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({ enum: ShippingCarrier, required: false })
  @IsEnum(ShippingCarrier)
  @IsOptional()
  carrier?: ShippingCarrier;

  @ApiProperty({ type: Date, required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedBy?: Date;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  shippedOn?: Date;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
