import { PrismaService } from '@/services/Prisma.service';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AddressResponseDto } from '../../dtos/AddressesListResponse.dto';
import { GetAddressByIdQuery } from './GetAddressByIdQuery';

@QueryHandler(GetAddressByIdQuery)
export class GetAddressByIdQueryHandler implements IQueryHandler<GetAddressByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAddressByIdQuery): Promise<AddressResponseDto> {
    const { addressId, userId } = query;

    const address = await this.prisma.customer_Address.findFirst({
      where: {
        Customer_ID: userId,
        Address_ID: addressId,
        Deleted_At: null,
      },
      include: {
        customer: {
          select: {
            Customer_ID: true,
            First_Name: true,
            Last_Name: true,
          },
        },
      },
    });

    if (!address)
      throw new NotFoundException(
        `Address ${addressId} not found for this customer`,
      );

    return {
      id: address.Address_ID,
      line1: address.Address_Line1,
      line2: address.Address_Line2 ?? undefined,
      city: address.City,
      state: address.State,
      zipcode: address.Zip_Code,
      country: address.Country,
      customerRef: {
        key: address.Customer_ID.toString(),
        value: `${address.customer.First_Name} ${address.customer.Last_Name}`,
      },
    };
  }
}
