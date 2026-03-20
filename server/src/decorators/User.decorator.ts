import { AuthUserDto } from '@/features/auth/types/AuthUserDto.type';
import { getRequest } from '@/utils/getRequest';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Parameter decorator that extracts the authenticated user from the request.
 *
 * `JwtStrategy.validate()` attaches the decoded JWT payload to `request.user`
 * after a successful token verification. This decorator reads that value and
 * injects it directly into the controller method parameter.
 *
 * Throws `UnauthorizedException` if `request.user` is somehow absent (which
 * shouldn't happen on guarded routes, but provides a safety net).
 *
 * @example
 * @Get('me')
 * async getProfile(@User() user: AuthUserDto) {
 *   return user;
 * }
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUserDto => {
    const request = getRequest(ctx);
    const user = request.user;
    if (!user) throw new UnauthorizedException('Unauthorized');
    return user;
  },
);
