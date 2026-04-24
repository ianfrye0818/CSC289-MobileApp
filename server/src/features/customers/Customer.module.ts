import { Module } from '@nestjs/common';
import { UpdateCustomerCommandHandler } from './commands/UpdateCustomerCommandHandler';
import { CustomerController } from './Customer.controller';
import { GetCurrentCustomerDetailsQueryHandler } from './queries/GetCurrentCustomerDetails/GetCurrentCustomerDetailsQueryHandler';
import { GetCustomerByEmailQueryHandler } from './queries/GetCustomerByEmail/GetCustomerByEmailQueryHandler';

@Module({
  providers: [
    GetCustomerByEmailQueryHandler,
    GetCurrentCustomerDetailsQueryHandler,
    UpdateCustomerCommandHandler,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
