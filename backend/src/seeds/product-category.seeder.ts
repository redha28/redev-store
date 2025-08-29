import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ProductCategory } from '../modules/product/entities/product-category.entity';

export class ProductCategorySeeder {
  private static readonly logger = new Logger('ProductCategorySeeder');

  static async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(ProductCategory);

    // Check if categories already exist
    const existingCategories = await repository.count();
    if (existingCategories > 0) {
      this.logger.log('Product categories already exist, skipping seed');
      return;
    }

    const categories = [
      {
        name: 'Electronics',
        description:
          'Electronic devices, gadgets, and accessories including laptops, smartphones, and tablets',
      },
      {
        name: 'Fashion',
        description:
          'Clothing, shoes, accessories, and fashion items for men and women',
      },
      {
        name: 'Home & Living',
        description:
          'Furniture, home decor, kitchen appliances, and household essentials',
      },
    ];

    const categoryEntities = repository.create(categories);
    await repository.save(categoryEntities);

    this.logger.log('✅ Product categories seeded successfully');
    this.logger.log(`📊 Created ${categories.length} categories`);
  }
}
