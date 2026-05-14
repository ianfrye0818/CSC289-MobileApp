import { Query } from '@nestjs/cqrs';
import { GetOrdersShippingStatusRequest } from './Request';
import { GetOrdersShippingStatusResponse } from './Response';

export class GetOrdersShippingStatusQuery extends Query<
  GetOrdersShippingStatusResponse[]
> {
  constructor(public readonly request: GetOrdersShippingStatusRequest) {
    super();
  }
}
