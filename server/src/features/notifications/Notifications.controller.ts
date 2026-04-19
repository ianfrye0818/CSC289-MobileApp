import { User } from '@/decorators/User.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { RegisterPushTokenCommand } from './commands/RegisterPushToken/RegisterPushTokenCommand';
import { RegisterPushTokenRequestDto } from './dtos/RegisterPushTokenRequest.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register-token')
  @ApiOperation({ summary: 'Register device push token' })
  @ApiOkResponse({ description: 'Token registered successfully' })
  async registerToken(
    // Replaced inline `{ token: string }` with the validated DTO — Matches the
    // codebase convention and adds format validation on the Expo push token.
    @Body() body: RegisterPushTokenRequestDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new RegisterPushTokenCommand(user.id, body.token),
    );
  }
}
