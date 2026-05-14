import { Public } from '@/decorators/Public.decorator';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOrdersShippingStatusQuery } from './GetOrdersShippingStatus/GetOrdersShippingStatusQuery';
import { GetOrdersShippingStatusRequest } from './GetOrdersShippingStatus/Request';
import { GetOrdersShippingStatusResponse } from './GetOrdersShippingStatus/Response';
import { UpdateShippingCommand } from './UpdateShipping/UpdateShippingCommand';
import { UpdateShippingRequest } from './UpdateShipping/UpdateShippingRequest';

@ApiTags('Shipping')
@Public()
@Controller('shipping')
export class ShippingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get('status')
  @ApiOperation({ summary: 'Get shipping status' })
  @ApiOkResponse({ type: [GetOrdersShippingStatusResponse] })
  async getShippingStatus(@Query() query: GetOrdersShippingStatusRequest) {
    return this.queryBus.execute(new GetOrdersShippingStatusQuery(query));
  }

  @Patch('status')
  @ApiOperation({ summary: 'Update shipping status' })
  @ApiBody({ type: UpdateShippingRequest })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateShippingStatus(@Body() dto: UpdateShippingRequest) {
    return this.commandBus.execute(new UpdateShippingCommand(dto));
  }
}
