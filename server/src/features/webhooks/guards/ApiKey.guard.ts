import { ConfigService } from '@/services/ConfigService/Config.service';
import { getRequest } from '@/utils/getRequest';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard that validates the API key for the webhooks endpoint.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.configService.get('WEBHOOK_API_KEY'))
      throw new UnauthorizedException('Api key is not valid');

    return true;
  }
}
