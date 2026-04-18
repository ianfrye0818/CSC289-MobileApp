import { User } from '@/decorators/User.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { RegisterPushTokenCommand } from './commands/RegisterPushToken/RegisterPushTokenCommand';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register-token')
  @ApiOperation({ summary: 'Register device push token' })
  @ApiOkResponse({ description: 'Token registered successfully' })
  async registerToken(
    @Body() body: { token: string },
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new RegisterPushTokenCommand(user.id, body.token),
    );
  }
}
