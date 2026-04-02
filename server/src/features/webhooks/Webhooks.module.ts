import { Module } from '@nestjs/common';
import { EmitWebhookEventCommandHandler } from './commands/EmitWebhookEvent/EmitWebhookEventCommandHandler';
import { RegisterWebhookCommandHandler } from './commands/RegisterWebhook/RegisterWebhookCommandHandler';
import { WebhooksController } from './Webhooks.controller';

@Module({
  providers: [EmitWebhookEventCommandHandler, RegisterWebhookCommandHandler],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
