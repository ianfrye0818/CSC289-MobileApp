import { Public } from '@/decorators/Public.decorator';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRandomReviewsQuery } from './GetRandomReviews/GetRandomReviewsQuery';
import { Review } from './GetRandomReviews/ReviewResponse';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('random')
  @Public()
  @ApiOperation({ summary: 'Get random reviews' })
  @ApiOkResponse({ type: [Review] })
  async getRandomReviews(@Query('limit', ParseIntPipe) limit: number) {
    return this.queryBus.execute(new GetRandomReviewsQuery(limit));
  }
}
