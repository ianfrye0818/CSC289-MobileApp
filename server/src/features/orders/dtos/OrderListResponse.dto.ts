import { ApiProperty } from '@nestjs/swagger';
import { OrderCustomerDto } from './OrderCustomer.dto';

export class OrderListResponseDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: OrderCustomerDto, required: true })
  customer: OrderCustomerDto;

  @ApiProperty({ type: Date, required: true })
  orderDate: Date;

  @ApiProperty({ type: Number, required: true })
  totalAmount: number;
}
