import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductDto } from '../dto/product.dto';
import {
  FindProductQuery,
  ProductSortBy,
} from '../dto/queries/find-product.query';
import { ProductCategoryService } from './product-category.service';
import {
  ProductRelationService,
  ProductRelation,
} from './product-relation.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: ProductCategoryService,
    private readonly relationService: ProductRelationService,
    private readonly redisService: RedisService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const existingProduct = await this.productRepository.findOne({
      where: { code: createProductDto.code },
    });

    if (existingProduct) {
      throw new ConflictException('Product code already exists');
    }

    await this.categoryService.validateCategoryExists(
      createProductDto.categoryId,
    );

    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);

    await this.redisService.deleteByPattern('products:list:*');

    const relationMap = await this.relationService.getMapRelationProducts(
      [savedProduct],
      { category: true },
    );
    const relation = relationMap.get(savedProduct.id);

    return this.productToProductDto(savedProduct, relation);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.code && updateProductDto.code !== product.code) {
      const existingProduct = await this.productRepository.findOne({
        where: { code: updateProductDto.code },
      });

      if (existingProduct) {
        throw new ConflictException('Product code already exists');
      }
    }

    if (updateProductDto.categoryId) {
      await this.categoryService.validateCategoryExists(
        updateProductDto.categoryId,
      );
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    await this.redisService.deleteByPattern('products:list:*');

    const relationMap = await this.relationService.getMapRelationProducts(
      [updatedProduct],
      { category: true },
    );
    const relation = relationMap.get(updatedProduct.id);

    return this.productToProductDto(updatedProduct, relation);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock > 0) {
      throw new BadRequestException('Cannot delete product with stock > 0');
    }

    await this.productRepository.remove(product);
    await this.redisService.deleteByPattern('products:list:*');
  }

  async findAll(
    query?: FindProductQuery,
  ): Promise<{ data: ProductDto[]; total: number }> {
    const cacheKey = this.redisService.getCacheKey('products:list', query);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (query?.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(product.name) LIKE LOWER(:search)', {
            search: `%${query.search}%`,
          }).orWhere('LOWER(product.code) LIKE LOWER(:search)', {
            search: `%${query.search}%`,
          });
        }),
      );
    }

    if (query?.categoryIdList && query.categoryIdList.length > 0) {
      queryBuilder.andWhere('product.categoryId IN (:...categoryIds)', {
        categoryIds: query.categoryIdList,
      });
    }

    if (query?.inStock === true) {
      queryBuilder.andWhere('product.stock > 0');
    }

    const sortBy = query?.sortBy || ProductSortBy.CREATED_AT;
    const sortOrder = query?.sortOrder || 'DESC';
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    const total = await queryBuilder.getCount();

    // Apply pagination
    if (query?.limit) {
      queryBuilder.take(query.limit);
    }
    if (query?.offset) {
      queryBuilder.skip(query.offset);
    }

    const products = await queryBuilder.getMany();

    const relationMap = await this.relationService.getMapRelationProducts(
      products,
      { category: true },
    );

    const data = products.map((product) => {
      const relation = relationMap.get(product.id);
      return this.productToProductDto(product, relation);
    });

    const result = { data, total };
    await this.redisService.set(cacheKey, JSON.stringify(result), 60);
    return result;
  }

  async findAllSimple(): Promise<ProductDto[]> {
    const { data } = await this.findAll();
    return data;
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const relationMap = await this.relationService.getMapRelationProducts(
      [product],
      { category: true },
    );
    const relation = relationMap.get(product.id);

    return this.productToProductDto(product, relation);
  }

  protected productToProductDto(
    product: Product,
    relation?: ProductRelation,
  ): ProductDto {
    return {
      id: product.id,
      name: product.name,
      code: product.code,
      categoryId: product.categoryId,
      category: relation?.category ?? undefined,
      stock: product.stock,
      price: Number(product.price),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
