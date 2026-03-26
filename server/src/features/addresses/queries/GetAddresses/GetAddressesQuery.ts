import { Query } from '@nestjs/cqrs';
import { AddressListReponseDto } from '../../dtos/AddressesListResponse.dto';

export class GetAddressesQuery extends Query<AddressListReponseDto[]> {
  constructor(public readonly customerId: number) {
    super();
  }
}
