import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryDto } from '../dto/product-category.dto';

export type ProductRelation = {
  category: ProductCategoryDto | null;
};

type LoadRelation = Partial<Record<keyof ProductRelation, boolean>>;

@Injectable()
export class ProductRelationService {
  constructor(private readonly categoryService: ProductCategoryService) {}

  async getMapRelationProducts(
    products: Product[],
    loads: LoadRelation | undefined = undefined,
  ): Promise<Map<number, ProductRelation>> {
    const mapData = new Map<number, ProductRelation>();
    if (!products.length || !loads) {
      return Promise.resolve(mapData);
    }

    const categoryIds = [
      ...new Set(products.map((product) => product.categoryId)),
    ];

    let mapCategoryById = new Map<number, ProductCategoryDto>();
    if (loads?.category) {
      mapCategoryById =
        await this.categoryService.getMapCategoryByIds(categoryIds);
    }

    products.forEach((product) => {
      const data: ProductRelation = {
        category: null,
      };

      if (loads?.category) {
        data.category = mapCategoryById.get(product.categoryId) || null;
      }

      mapData.set(product.id, data);
    });

    return Promise.resolve(mapData);
  }
}
