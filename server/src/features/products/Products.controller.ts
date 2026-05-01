import { Public } from '@/decorators/Public.decorator';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDetailDto } from './dtos/ProductDetail.dto';
import { ProductListItemDto } from './dtos/ProductListItem.dto';
import { GetProductDetailsQuery } from './queries/GetProductDetails/GetProductDetailsQuery';
import { GetProductsQuery } from './queries/GetProducts/GetProductsQuery';
import { GetSuggestedProductsQuery } from './queries/GetSuggestedProducts/GetSuggestedProductsQuery';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(public readonly queryBus: QueryBus) {}

  // Get all products
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: [ProductListItemDto] })
  async getProducts() {
    return this.queryBus.execute(new GetProductsQuery());
  }

  // get prod by id
  @Get(':productId')
  @Public()
  @ApiOperation({ summary: 'Get product by productId' })
  @ApiParam({ type: Number, required: true, name: 'productId' })
  @ApiOkResponse({ type: ProductDetailDto })
  async getProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.queryBus.execute(new GetProductDetailsQuery(productId));
  }

  // get prod by id
  @Get(':productId/suggested')
  @Public()
  @ApiOperation({ summary: 'Get product by productId' })
  @ApiParam({ type: Number, required: true, name: 'productId' })
  @ApiOkResponse({ type: [ProductListItemDto] })
  async getSuggestedProducts(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.queryBus.execute(new GetSuggestedProductsQuery(productId));
  }
}
