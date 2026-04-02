import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmitWebhookEventCommand } from './commands/EmitWebhookEvent/EmitWebhookEventCommand';
import { RegisterWebhookCommand } from './commands/RegisterWebhook/RegisterWebhookCommand';
import { EmitEventRequestDto } from './dtos/EmitEventRequestDto';
import { RegisterWebhookRequestDto } from './dtos/RegisterWebhookRequestDto';
import { ApiKeyGuard } from './guards/ApiKey.guard';

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('emit')
  @ApiOperation({ summary: 'Emit a webhook event' })
  @ApiBody({ type: EmitEventRequestDto, required: true })
  emit(@Body() dto: EmitEventRequestDto) {
    this.commandBus.execute(new EmitWebhookEventCommand(dto));
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a webhook' })
  @ApiBody({ type: RegisterWebhookRequestDto, required: true })
  register(@Body() dto: RegisterWebhookRequestDto) {
    this.commandBus.execute(new RegisterWebhookCommand(dto));
  }
}
