import { Public } from '@/decorators/Public.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    // Re-emit internally so listeners (e.g. push notifications) can react to
    // externally-sourced events like shipping status updates from the fulfillment team.
    this.eventEmitter.emit(dto.event, dto.payload);
    this.commandBus.execute(new EmitWebhookEventCommand(dto));
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a webhook' })
  @ApiBody({ type: RegisterWebhookRequestDto, required: true })
  register(@Body() dto: RegisterWebhookRequestDto) {
    this.commandBus.execute(new RegisterWebhookCommand(dto));
  }
}
