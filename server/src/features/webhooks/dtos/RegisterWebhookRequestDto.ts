import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { WebhookEvents } from '../types/WebhookEvents.type';

export class RegisterWebhookRequestDto {
  @ApiProperty({ type: String, required: true, format: 'uri' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: [WebhookEvents], required: true })
  @IsArray()
  @IsNotEmpty()
  @IsEnum(WebhookEvents, { each: true })
  events: WebhookEvents[];
}
