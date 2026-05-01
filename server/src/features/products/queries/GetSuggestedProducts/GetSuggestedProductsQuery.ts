import { Query } from '@nestjs/cqrs';
import { ProductListItemDto } from '../../dtos/ProductListItem.dto';

export class GetSuggestedProductsQuery extends Query<ProductListItemDto[]> {
  constructor(public readonly productId: number) {
    super();
  }
}
