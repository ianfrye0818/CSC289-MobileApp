import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerDetailsResponseDto } from './models/CustomerDetailsResponse.dto';
import { GetCurrentCustomerDetailsQuery } from './queries/GetCurrentCustomerDetails/GetCurrentCustomerDetailsQuery';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':customerId')
  @ApiOperation({ summary: 'Get customer details' })
  @ApiOkResponse({ type: CustomerDetailsResponseDto })
  async getCustomerDetails(
    @Param('customerId', ParseIntPipe) customerId: number,
  ) {
    return this.queryBus.execute(
      new GetCurrentCustomerDetailsQuery(customerId),
    );
  }
}
