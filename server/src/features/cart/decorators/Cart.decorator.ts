import { getRequest } from '@/utils/getRequest';
import { Shopping_Cart } from '@generated/prisma/client';
import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

/**
 * Parameter decorator that extracts the current customer's shopping cart from
 * the request object.
 *
 * `CustomerCartGuard` runs before any cart route handler and attaches the
 * verified `Shopping_Cart` record to `request.cart`. This decorator reads that
 * value and injects it directly into the handler parameter.
 *
 * Throws `NotFoundException` if `request.cart` is absent — which should only
 * happen if the decorator is used on a route that is not protected by
 * `CustomerCartGuard`.
 *
 * @example
 * @Post('add')
 * async addItem(@Body() body: AddItemDto, @Cart() cart: Shopping_Cart) { ... }
 */
export const Cart = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Shopping_Cart => {
    const request = getRequest(ctx);
    if (!request.cart) throw new NotFoundException('Cart not found');
    return request.cart;
  },
);
