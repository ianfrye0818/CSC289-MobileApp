import { Command } from '@nestjs/cqrs';
import { AddressResponseDto } from '../../dtos/AddressesListResponse.dto';

export class GetAddressByIdQuery extends Command<AddressResponseDto> {
  constructor(
    public readonly addressId: number,
    public readonly userId: number,
  ) {
    super();
  }
}
