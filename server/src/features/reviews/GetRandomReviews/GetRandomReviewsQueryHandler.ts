import { PrismaService } from '@/services/Prisma.service';
import { pickRandom } from '@/utils/pickRandom';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { reviews } from '../data';
import { GetRandomReviewsQuery } from './GetRandomReviewsQuery';
import { Review } from './ReviewResponse';

@QueryHandler(GetRandomReviewsQuery)
export class GetRandomReviewsQueryHandler implements IQueryHandler<GetRandomReviewsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetRandomReviewsQuery): Promise<Review[]> {
    const { limit } = query;
    const customers = await this.prisma.customer.findMany({
      select: {
        Customer_ID: true,
        First_Name: true,
        Last_Name: true,
      },
    });

    const randomReviews: Review[] = Array.from({ length: limit ?? 10 }).map(
      () => {
        const customer = pickRandom(customers);
        const review = pickRandom(reviews);
        return {
          ...review,
          customer: {
            key: customer.Customer_ID.toString(),
            value: `${customer.First_Name} ${customer.Last_Name}`,
          },
        };
      },
    );
    return randomReviews;
  }
}
