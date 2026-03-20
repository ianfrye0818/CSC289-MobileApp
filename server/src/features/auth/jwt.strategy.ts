import { ConfigService } from '@/services/ConfigService/Config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserDto } from './types/AuthUserDto.type';

/**
 * Passport JWT strategy — validates incoming Bearer tokens on every protected
 * request.
 *
 * NestJS/Passport calls `validate()` automatically after the token has been
 * verified against `JWT_SECRET` and checked for expiry. The return value is
 * attached to `request.user` and made available via the `@User()` decorator.
 *
 * **Token extraction:** reads from the `Authorization: Bearer <token>` header.
 * **Expiry:** `ignoreExpiration: false` means expired tokens are rejected with
 * a 401 even if the signature is valid.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   * Maps the decoded JWT payload to the `AuthUserDto` shape stored on
   * `request.user`. Field names match the claims set in `LoginUserCommandHandler`.
   */
  async validate(payload: any): Promise<AuthUserDto> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
