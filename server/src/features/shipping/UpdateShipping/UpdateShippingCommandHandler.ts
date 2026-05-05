import { WebhookEvents } from '@/features/webhooks/types/WebhookEvents.type';
import { PrismaService } from '@/services/Prisma.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateShippingCommand } from './UpdateShippingCommand';

@CommandHandler(UpdateShippingCommand)
export class UpdateShippingCommandHandler implements ICommandHandler<UpdateShippingCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: UpdateShippingCommand): Promise<void> {
    const {
      dto: {
        orderId,
        status,
        carrier,
        cost,
        expectedBy,
        shippedOn,
        trackingNumber,
        notes,
      },
    } = command;

    await this.prisma.shipping.updateMany({
      where: { Order_ID: orderId },
      data: {
        Ship_Status: status,
        Carrier: carrier,
        Cost: cost,
        Expected_By: expectedBy,
        Shipped_On: shippedOn,
        Tracking_Number: trackingNumber,
        Updated_At: new Date(),
        Status_Updated_At: status ? new Date() : null,
        Shipment_Notes: notes,
      },
    });

    if (status) {
      this.eventEmitter.emit(WebhookEvents.SHIPPING_STATUS_UPDATED, {
        orderId,
      });
    }
  }
}
