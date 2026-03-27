import { PrismaService } from '@/services/Prisma.service';
import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { AddressResponseDto } from '../../dtos/AddressesListResponse.dto';
import { GetAddressesQuery } from './GetAddressesQuery';

@QueryHandler(GetAddressesQuery)
export class GetAddressesQueryHandler implements ICommandHandler<GetAddressesQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: GetAddressesQuery): Promise<AddressResponseDto[]> {
    const { customerId } = command;

    const addresses = await this.prisma.customer_Address.findMany({
      where: { Customer_ID: customerId, Deleted_At: null },
      include: {
        customer: {
          select: {
            Customer_ID: true,
            First_Name: true,
            Last_Name: true,
          },
        },
      },
      orderBy: { Created_At: 'desc' },
    });

    return addresses.map((addr) => ({
      id: addr.Address_ID,
      line1: addr.Address_Line1,
      line2: addr.Address_Line2 ?? undefined,
      city: addr.City,
      state: addr.State,
      zipcode: addr.Zip_Code,
      country: addr.Country,
      createdAt: addr.Created_At,
      updatedAt: addr.Updated_At,
      customerRef: {
        key: addr.customer.Customer_ID.toString(),
        value: `${addr.customer.First_Name} ${addr.customer.Last_Name}`,
      },
    }));
  }
}
