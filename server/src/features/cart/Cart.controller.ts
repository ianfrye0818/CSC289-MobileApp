import { User } from '@/decorators/User.decorator';
import {
  DeletedMessageResponse,
  UpdatedMessageResponse,
} from '@/types/MessageReponse.type';
import * as Prisma from '@generated/prisma/client';
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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { AddItemToCartCommand } from './commands/AddItemToCart/AddItemToCartCommand';
import { DeleteCartCommand } from './commands/DeleteCart/DeleteCartCommand';
import { RemoveItemFromCartCommand } from './commands/RemoveItemFromCart/RemoveItemFromCartCommand';
import { UpdateItemQuantityCommand } from './commands/UpdateItemQuantity/UpdateItemQuantityCommand';
import { Cart } from './decorators/Cart.decorator';
import { AddItemToCartRequestDto } from './dtos/AddItemToCartRequest.dto';
import { ShoppingCartResponseDto } from './dtos/ShoppingCartResponse.dto';
import { UpdateItemQuantityRequestDto } from './dtos/UpdateItemQuantityRequest.dto';
import { GetCurrentCustomerCartQuery } from './queries/GetCurrentCustomerCart/GetCurrentCustomerCartQuery';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  // get current users cart GET /cart
  @Get()
  @ApiOperation({ summary: 'Get current users cart' })
  @ApiOkResponse({ type: ShoppingCartResponseDto })
  async getCurrentCustomerCart(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCurrentCustomerCartQuery(user.id));
  }

  // add item to cart POST /cart/items
  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddItemToCartRequestDto })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async addItemToCart(
    @Body() body: AddItemToCartRequestDto,
    @Cart() cart: Prisma.Shopping_Cart,
  ) {
    return this.commandBus.execute(new AddItemToCartCommand(cart, body));
  }

  // Update quantity of an item in the cart PATCH /cart/itesm/:productId
  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update quantity of an item in the cart' })
  @ApiBody({ type: UpdateItemQuantityRequestDto })
  @ApiOkResponse({ type: UpdatedMessageResponse })
  async updateItemQuantity(
    @Body() body: UpdateItemQuantityRequestDto,
    @Cart() cart: Prisma.Shopping_Cart,
  ) {
    return this.commandBus.execute(new UpdateItemQuantityCommand(cart, body));
  }

  // Delete an item from the cart DELETE /cart/items/:productId
  @Delete('items/:productId')
  @ApiOperation({ summary: 'Delete an item from the cart' })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteItemFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Cart() cart: Prisma.Shopping_Cart,
  ) {
    return this.commandBus.execute(
      new RemoveItemFromCartCommand(cart, productId),
    );
  }
  // Delete Cart DELETE /cart
  @Delete()
  @ApiOperation({ summary: 'Delete cart' })
  @ApiOkResponse({ type: DeletedMessageResponse })
  async deleteCart(@Cart() cart: Prisma.Shopping_Cart) {
    return this.commandBus.execute(new DeleteCartCommand(cart));
  }
}
