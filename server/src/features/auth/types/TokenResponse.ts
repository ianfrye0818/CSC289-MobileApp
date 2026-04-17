import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ type: String, required: true })
  accessToken: string;
}
