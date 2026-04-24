import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './UpdateCustomerCommand';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerCommandHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(private readonly prisma: PrismaService) {} 
  
  async execute(
    command: UpdateCustomerCommand,
  ): Promise<UpdatedMessageResponse> {
    const { customerId, dto, userId } = command;

    const exisiting = await this.prisma.customer.findFirst({
      where: { Customer_ID: customerId },
    });

    if (!exisiting)
      throw new NotFoundException(`Customer ${customerId} not found`);

    if (exisiting.Customer_ID !== userId)
      throw new ForbiddenException(
        'You are not authorized to update this customer',
      );

    await this.prisma.customer.update({
      where: { Customer_ID: exisiting.Customer_ID },
      data: {
        First_Name: dto.firstName,
        Last_Name: dto.lastName,
        Phone: dto.phone,
        Updated_At: new Date(),
        },
    });

    return new UpdatedMessageResponse(
        `Customer ${customerId} updated successfully`,
        customerId,
        );
    }
}