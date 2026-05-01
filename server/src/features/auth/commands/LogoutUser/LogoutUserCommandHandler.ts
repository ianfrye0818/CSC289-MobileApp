import { PushTokenService } from '@/services/PushTokenService';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutUserCommand } from './LogoutUserCommand';

@CommandHandler(LogoutUserCommand)
export class LogoutUserCommandHandler implements ICommandHandler<LogoutUserCommand> {
  constructor(private readonly pushTokenService: PushTokenService) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const { userId, pushToken } = command;
    console.log({ pushToken });
    if (!pushToken) {
      return;
    }

    await this.pushTokenService.removeToken(userId, pushToken);
  }
}
