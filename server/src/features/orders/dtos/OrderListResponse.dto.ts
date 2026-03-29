import { ApiProperty } from '@nestjs/swagger';
import { OrderCustomerDto } from './OrderCustomer.dto';

export class OrderListResponseDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: OrderCustomerDto, required: true })
  customer: OrderCustomerDto;

  /**
   * ISO 8601 date string. Changed from Date to string because JSON
   * has no Date type — the value is always serialised as a string.
   * class-transformer serialises Date objects as `{}` which breaks
   * the mobile client. — D3adMan, ticket #14
   */
  @ApiProperty({ type: String, format: 'date-time', required: true })
  orderDate: string;

  @ApiProperty({ type: Number, required: true })
  totalAmount: number;
}
