import { User } from '@/decorators/User.decorator';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { CustomerDetailsResponseDto } from './models/CustomerDetailsResponse.dto';
import { GetCurrentCustomerDetailsQuery } from './queries/GetCurrentCustomerDetails/GetCurrentCustomerDetailsQuery';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @ApiOperation({ summary: 'Get customer details' })
  @ApiOkResponse({ type: CustomerDetailsResponseDto })
  async getCurrentCustomerDetails(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCurrentCustomerDetailsQuery(user.id));
  }
}
