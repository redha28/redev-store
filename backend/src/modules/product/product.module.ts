import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductCategoryService } from './services/product-category.service';
import { ProductRelationService } from './services/product-relation.service';
import { ProductController } from './controller/product.controller';
import { ProductCategoryController } from './controller/product-category.controller';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory]), RedisModule],
  controllers: [ProductController, ProductCategoryController],
  providers: [ProductService, ProductCategoryService, ProductRelationService],
  exports: [ProductService, ProductCategoryService, ProductRelationService],
})
export class ProductModule {}
