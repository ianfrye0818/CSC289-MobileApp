import { Query } from '@nestjs/cqrs';
import { ShoppingCartResponseDto } from '../../dtos/ShoppingCartResponse.dto';

export class GetCurrentCustomerCartQuery extends Query<ShoppingCartResponseDto> {
  constructor(public readonly customerId: number) {
    super();
  }
}
