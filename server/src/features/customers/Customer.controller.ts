import { User } from '@/decorators/User.decorator';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { UpdateCustomerCommand } from './commands/UpdateCustomerCommand';
import { CustomerDetailsResponseDto } from './models/CustomerDetailsResponse.dto';
import { GetCurrentCustomerDetailsQuery } from './queries/GetCurrentCustomerDetails/GetCurrentCustomerDetailsQuery';
import { UpdateCustomerRequestDto } from './UpdateCustomer/UpdateCustomerRequestDto';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get customer details' })
  @ApiOkResponse({ type: CustomerDetailsResponseDto })
  async getCurrentCustomerDetails(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCurrentCustomerDetailsQuery(user.id));
  }

  @Patch(':customerId')
  @ApiOperation({ summary: 'Update customer details' })
  @ApiBody({ type: UpdateCustomerRequestDto })
  @ApiParam({ name: 'customerId', type: Number, required: true })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateCustomerDetails(
    @Param('customerId') customerId: number,
    @Body() body: UpdateCustomerRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UpdateCustomerCommand(customerId, body, user.id),
    );
  }
}
