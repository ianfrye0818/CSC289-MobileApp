import { Command } from '@nestjs/cqrs';

export class LogoutUserCommand extends Command<void> {
  constructor(
    public readonly userId: number,
    public readonly pushToken: string | undefined,
  ) {
    super();
  }
}
