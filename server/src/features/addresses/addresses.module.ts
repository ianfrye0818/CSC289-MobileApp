import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddAddressCommandHandler } from './commands/AddAddress/AddAddressCommandHandler';
import { DeleteAddressCommandHandler } from './commands/DeleteAddress/DeleteAddressCommandHandler';
import { UpdateAddressCommandHandler } from './commands/UpdateAddress/UpdateAddressCommandHandler';
import { GetAddressByIdQueryHandler } from './queries/GetAddressById/GetAddressByIdQueryHandler';
import { GetAddressesQueryHandler } from './queries/GetAddresses/GetAddressesQueryHandler';

@Module({
  providers: [
    AddAddressCommandHandler,
    UpdateAddressCommandHandler,
    DeleteAddressCommandHandler,
    GetAddressesQueryHandler,
    GetAddressByIdQueryHandler,
  ],
  controllers: [AddressesController],
})
export class AddressesModule {}
