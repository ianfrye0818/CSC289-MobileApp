import { Query } from '@nestjs/cqrs';
import { Review } from './ReviewResponse';

export class GetRandomReviewsQuery extends Query<Review[]> {
  constructor(public readonly limit: number) {
    super();
  }
}
