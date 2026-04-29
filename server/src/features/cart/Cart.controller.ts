import { User } from '@/decorators/User.decorator';
import {
  DeletedMessageResponse,
  UpdatedMessageResponse,
} from '@/types/MessageReponse.type';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { AddItemToCartCommand } from './commands/AddItemToCart/AddItemToCartCommand';
import { DeleteCurrentCustomersCartsCommand } from './commands/DeleteCart/DeleteCurrentUsersCartsCommand';
import {
  RemoveItemFromCartCommand,
  RemoveItemFromCartRequestDto,
} from './commands/RemoveItemFromCart/RemoveItemFromCartCommand';
import { UpdateItemQuantityCommand } from './commands/UpdateItemQuantity/UpdateItemQuantityCommand';
import { AddItemToCartRequestDto } from './dtos/AddItemToCartRequest.dto';
import { ShoppingCartResponseDto } from './dtos/ShoppingCartResponse.dto';
import { UpdateItemQuantityRequestDto } from './dtos/UpdateItemQuantityRequest.dto';
import {
  GetCartQtyQuery,
  GetCartQtyResponseDto,
} from './queries/GetCartQty/GetCartQtyQuery';
import { GetCurrentCustomerCartQuery } from './queries/GetCurrentCustomerCart/GetCurrentCustomerCartQuery';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current users cart' })
  @ApiOkResponse({ type: ShoppingCartResponseDto })
  async getCurrentCustomerCart(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCurrentCustomerCartQuery(user.id));
  }

  @Get('qty')
  @ApiOperation({ summary: 'Get cart quantity' })
  @ApiOkResponse({ type: GetCartQtyResponseDto })
  async getCartQty(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCartQtyQuery(user.id));
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddItemToCartRequestDto })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async addItemToCart(
    @Body() body: AddItemToCartRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(new AddItemToCartCommand(user.id, body));
  }

  @Patch('item')
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  @ApiBody({ type: UpdateItemQuantityRequestDto })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateItemQuantity(
    @Body() body: UpdateItemQuantityRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UpdateItemQuantityCommand(user.id, body),
    );
  }

  // Delete Cart DELETE /cart
  @Delete()
  @ApiOperation({ summary: 'Delete current customers carts' })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteCurrentCustomersCarts(@User() user: AuthUserDto) {
    return this.commandBus.execute(
      new DeleteCurrentCustomersCartsCommand(user.id),
    );
  }

  @Delete('item')
  @ApiOperation({ summary: 'Delete an item from the cart' })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteItemFromCart(
    @Body() body: RemoveItemFromCartRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new RemoveItemFromCartCommand(user.id, body),
    );
  }
}
