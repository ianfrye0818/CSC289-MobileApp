import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerByEmailQuery } from './GetCustomerByEmailQuery';

/**
 * Handles `GetCustomerByEmailQuery` — looks up a customer record by their
 * unique email address.
 *
 * Returns `null` (not an exception) when no customer is found, so the caller
 * (`LoginUserCommandHandler`) can decide how to handle the absence.
 * `Email` has a unique constraint in the database so `findUnique` is safe here.
 */
@QueryHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailQueryHandler implements IQueryHandler<GetCustomerByEmailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCustomerByEmailQuery): Promise<any> {
    return this.prisma.customer.findUnique({
      where: {
        Email: query.email,
      },
    });
  }
}
