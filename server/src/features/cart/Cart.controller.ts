import { User } from '@/decorators/User.decorator';
import {
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

  @Patch('items/:cartId')
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  @ApiBody({ type: UpdateItemQuantityRequestDto })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateItemQuantity(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body() body: UpdateItemQuantityRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UpdateItemQuantityCommand(cartId, user.id, body),
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

  @Delete('items/:cartId')
  @ApiOperation({ summary: 'Delete an item from the cart' })
  @ApiParam({ name: 'cartId', type: Number, required: true })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteItemFromCart(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body() body: RemoveItemFromCartRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new RemoveItemFromCartCommand(cartId, user.id, body),
    );
  }
}
