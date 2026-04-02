import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { WebhookEvents } from '../types/WebhookEvents.type';

export class EmitEventRequestDto {
  @ApiProperty({ enum: WebhookEvents, required: true })
  @IsEnum(WebhookEvents)
  @IsNotEmpty()
  event: WebhookEvents;

  @ApiProperty({ type: Object, required: true, additionalProperties: true })
  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;
}
