import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAddressCommand } from './DeleteAddressCommand';

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressCommandHandler implements ICommandHandler<DeleteAddressCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: DeleteAddressCommand,
  ): Promise<DeletedMessageResponse> {
    const { addressId, userId } = command;

    const existing = await this.prisma.customer_Address.findFirst({
      where: { Address_ID: addressId },
    });

    if (!existing)
      throw new NotFoundException(`Address ${addressId} not found`);

    if (existing.Customer_ID !== userId)
      throw new ForbiddenException(
        'You are not authorized to delete this address',
      );

    await this.prisma.customer_Address.update({
      where: { Address_ID: existing.Address_ID },
      data: {
        Deleted_At: new Date(),
        Updated_At: new Date(),
      },
    });

    return new DeletedMessageResponse(
      `Address ${addressId} deleted successfully`,
      addressId,
    );
  }
}
