import { RedisService } from '@/services/Redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PushTokenService {
  constructor(private readonly redisService: RedisService) {}

  public async getTokens(customerId: number): Promise<string[]> {
    const tokens = await this.redisService.hvals(`push-tokens:${customerId}`);
    return tokens.map((token) => token as string);
  }

  public async addToken(customerId: number, token: string): Promise<void> {
    await this.redisService.hset(`push-tokens:${customerId}`, {
      [token]: token,
    });
  }

  public async removeToken(customerId: number, token: string): Promise<void> {
    await this.redisService.hdel(`push-tokens:${customerId}`, token);
  }

  public async removeAllTokens(customerId: number): Promise<void> {
    await this.redisService.del(`push-tokens:${customerId}`);
  }
}
