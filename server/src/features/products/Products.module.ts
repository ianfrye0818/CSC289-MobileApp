import { Module } from '@nestjs/common';
import { ProductsController } from './Products.controller';
import { GetProductDetailsQueryHandler } from './queries/GetProductDetails/GetProductDetailsQueryHandler';
import { GetProductsQueryHandler } from './queries/GetProducts/GetProductsQueryHandler';
import { GetSuggestedProductsQueryHandler } from './queries/GetSuggestedProducts/GetSuggestedProductsQueryHandler';

@Module({
  providers: [
    GetProductsQueryHandler,
    GetProductDetailsQueryHandler,
    GetSuggestedProductsQueryHandler,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
