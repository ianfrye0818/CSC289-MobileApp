import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAddressCommand } from './UpdateAddressCommand';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressCommandHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: UpdateAddressCommand,
  ): Promise<UpdatedMessageResponse> {
    const { addressId, customerId, dto } = command;

    const exisiting = await this.prisma.customer_Address.findFirst({
      where: { Address_ID: addressId, Customer_ID: customerId },
    });

    if (!exisiting)
      throw new NotFoundException(
        `Address ${addressId} not found for customer ${customerId}`,
      );

    await this.prisma.customer_Address.update({
      where: { Address_ID: exisiting.Address_ID },
      data: {
        Address_Line1: dto.line1,
        Address_Line2: dto.line2,
        City: dto.city,
        State: dto.state,
        Zip_Code: dto.zipcode,
        Updated_At: new Date(),
      },
    });

    return new UpdatedMessageResponse(
      `Address ${addressId} updated successfully`,
      addressId,
    );
  }
}
