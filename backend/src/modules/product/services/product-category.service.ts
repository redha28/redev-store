import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductCategoryDto } from '../dto/product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll(): Promise<ProductCategoryDto[]> {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });

    return categories.map((category) => this.categoryToCategoryDto(category));
  }

  async findOne(id: number): Promise<ProductCategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category tidak ditemukan');
    }

    return this.categoryToCategoryDto(category);
  }

  async validateCategoryExists(id: number): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category tidak ditemukan');
    }

    return category;
  }

  async getMapCategoryByIds(
    ids: number[],
  ): Promise<Map<number, ProductCategoryDto>> {
    const mapData = new Map<number, ProductCategoryDto>();

    if (!ids.length) {
      return mapData;
    }

    const categories = await this.categoryRepository.find({
      where: { id: In(ids) },
    });

    categories.forEach((category) => {
      mapData.set(category.id, this.categoryToCategoryDto(category));
    });

    return mapData;
  }

  protected categoryToCategoryDto(
    category: ProductCategory,
  ): ProductCategoryDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
