import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Body payload for `POST /notifications/register-token`.
 *
 * Validates the incoming string is shaped like an Expo push token
 * (`ExponentPushToken[...]`) so garbage or attacker-supplied values don't
 * flow through to the push-send path and cause downstream SDK errors.
 */
export class RegisterPushTokenRequestDto {
  @ApiProperty({
    description: "The client device's Expo push token.",
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  @IsString()
  @IsNotEmpty()
  // Format check only — the SDK will do its own validation before send as well.
  @Matches(/^ExponentPushToken\[[^\]]+\]$/, {
    message: 'token must be an Expo push token (ExponentPushToken[...])',
  })
  token: string;
}
