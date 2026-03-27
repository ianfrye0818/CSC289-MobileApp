import { Query } from '@nestjs/cqrs';
import { AddressResponseDto } from '../../dtos/AddressesListResponse.dto';

export class GetAddressesQuery extends Query<AddressResponseDto[]> {
  constructor(public readonly customerId: number) {
    super();
  }
}
