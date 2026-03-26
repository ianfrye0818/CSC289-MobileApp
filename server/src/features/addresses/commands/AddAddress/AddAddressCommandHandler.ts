import { PrismaService } from '@/services/Prisma.service';
import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddAddressCommand } from './AddAddressCommand';

@CommandHandler(AddAddressCommand)
export class AddAddressCommandHandler implements ICommandHandler<AddAddressCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: AddAddressCommand): Promise<CreatedMessageResponse> {
    const { customerId, dto } = command;

    const newAddress = await this.prisma.customer_Address.create({
      data: {
        Customer_ID: customerId,
        Address_Line1: dto.line1,
        Address_Line2: dto.line2,
        City: dto.city,
        State: dto.state,
        Zip_Code: dto.zipcode,
        Country: 'USA',
      },
    });

    return new CreatedMessageResponse(
      `Address ${newAddress.Address_ID} created successfully`,
      newAddress.Address_ID,
    );
  }
}
