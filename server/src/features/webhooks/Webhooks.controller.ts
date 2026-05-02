import { Public } from '@/decorators/Public.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmitWebhookEventCommand } from './commands/EmitWebhookEvent/EmitWebhookEventCommand';
import { RegisterWebhookCommand } from './commands/RegisterWebhook/RegisterWebhookCommand';
import { EmitEventRequestDto } from './dtos/EmitEventRequestDto';
import { RegisterWebhookRequestDto } from './dtos/RegisterWebhookRequestDto';
import { WebhookEvents } from './types/WebhookEvents.type';

@ApiTags('Webhooks')
@Controller('webhooks')
@Public()
export class WebhooksController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('events')
  @Public()
  @ApiOperation({ summary: 'Get a list of all webhook events' })
  @ApiOkResponse({ type: [String] })
  getEvents() {
    return Object.values(WebhookEvents);
  }

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
