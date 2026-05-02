import { Module } from '@nestjs/common';
import { GetRandomReviewsQueryHandler } from './GetRandomReviews/GetRandomReviewsQueryHandler';
import { ReviewsController } from './Reviews.controller';

@Module({
  providers: [GetRandomReviewsQueryHandler],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
