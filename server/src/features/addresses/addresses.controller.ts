import { User } from '@/decorators/User.decorator';
import {
  CreatedMessageResponse,
  DeletedMessageResponse,
  UpdatedMessageResponse,
} from '@/types/MessageReponse.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { AddAddressCommand } from './commands/AddAddress/AddAddressCommand';
import { DeleteAddressCommand } from './commands/DeleteAddress/DeleteAddressCommand';
import { UpdateAddressCommand } from './commands/UpdateAddress/UpdateAddressCommand';
import { AddAddressRequestDto } from './dtos/AddAddressRequest.dto';
import { AddressResponseDto } from './dtos/AddressesListResponse.dto';
import { UpdateAddressRequestDto } from './dtos/UpdateAddressRequest.dto';
import { GetAddressByIdQuery } from './queries/GetAddressById/GetAddressByIdQuery';
import { GetAddressesQuery } from './queries/GetAddresses/GetAddressesQuery';

@ApiTags('Customer Addresses')
@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get customer addresses' })
  @ApiOkResponse({ type: [AddressResponseDto] })
  async getCustomerAddresses(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetAddressesQuery(user.id));
  }

  @Get(':addressId')
  @ApiOperation({ summary: 'Get customer addresses' })
  @ApiOkResponse({ type: AddressResponseDto })
  @ApiParam({ name: 'addressId', type: Number, required: true })
  async getCustomerAddressesById(
    @Param('addressId', ParseIntPipe) addressId: number,
    @User() user: AuthUserDto,
  ) {
    return this.queryBus.execute(new GetAddressByIdQuery(addressId, user.id));
  }

  @Post()
  @ApiOperation({ summary: 'Add an address for a customer' })
  @ApiBody({ type: AddAddressRequestDto, required: true })
  @ApiOkResponse({ type: CreatedMessageResponse })
  async addAddress(
    @Body() body: AddAddressRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(new AddAddressCommand(body, user.id));
  }

  @Patch(':addressId')
  @ApiOperation({ summary: 'Update an address for a customer' })
  @ApiBody({ type: UpdateAddressRequestDto, required: true })
  @ApiParam({ name: 'addressId', type: Number, required: true })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() body: UpdateAddressRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UpdateAddressCommand(addressId, body, user.id),
    );
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Soft delete an address for a customer' })
  @ApiParam({ name: 'addressId', type: Number, required: true })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new DeleteAddressCommand(addressId, user.id),
    );
  }
}
