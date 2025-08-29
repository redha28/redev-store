import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Product } from '../modules/product/entities/product.entity';
import { ProductCategory } from '../modules/product/entities/product-category.entity';

export class ProductSeeder {
  private static readonly logger = new Logger('ProductSeeder');

  static async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(ProductCategory);

    // Check if products already exist
    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
      this.logger.log('Products already exist, skipping seed');
      return;
    }

    // Get categories for reference
    const categories = await categoryRepository.find();
    if (categories.length === 0) {
      this.logger.error(
        '❌ No categories found. Please run category seeder first',
      );
      return;
    }

    // Debug: Log existing categories
    this.logger.log('🔍 Available categories:');
    categories.forEach((cat) => {
      this.logger.log(`  - ID: ${cat.id}, Name: "${cat.name}"`);
    });

    // Find categories by name (case-insensitive)
    const electronicsCategory = categories.find(
      (c) => c.name.toLowerCase() === 'electronics',
    );
    const fashionCategory = categories.find(
      (c) => c.name.toLowerCase() === 'fashion',
    );
    const homeCategory = categories.find(
      (c) => c.name.toLowerCase() === 'home & living',
    );

    if (!electronicsCategory || !fashionCategory || !homeCategory) {
      this.logger.error(
        '❌ Required categories not found. Expected: Electronics, Fashion, Home & Living',
      );
      this.logger.error(
        `Found: Electronics=${!!electronicsCategory}, Fashion=${!!fashionCategory}, Home & Living=${!!homeCategory}`,
      );
      return;
    }

    const products = [
      // Electronics
      {
        name: 'Gaming Laptop ASUS ROG',
        code: 'ELC001',
        categoryId: electronicsCategory.id,
        stock: 15,
        price: 18500000.0,
      },
      {
        name: 'iPhone 15 Pro Max',
        code: 'ELC002',
        categoryId: electronicsCategory.id,
        stock: 25,
        price: 21000000.0,
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        code: 'ELC003',
        categoryId: electronicsCategory.id,
        stock: 50,
        price: 4200000.0,
      },

      // Fashion
      {
        name: 'Nike Air Jordan Retro',
        code: 'FSH001',
        categoryId: fashionCategory.id,
        stock: 30,
        price: 2800000.0,
      },
      {
        name: 'Uniqlo Cotton T-Shirt',
        code: 'FSH002',
        categoryId: fashionCategory.id,
        stock: 100,
        price: 199000.0,
      },
      {
        name: "Levi's 501 Original Jeans",
        code: 'FSH003',
        categoryId: fashionCategory.id,
        stock: 75,
        price: 1200000.0,
      },

      // Home & Living
      {
        name: 'IKEA Study Desk',
        code: 'HOM001',
        categoryId: homeCategory.id,
        stock: 20,
        price: 1500000.0,
      },
      {
        name: 'Philips Air Fryer',
        code: 'HOM002',
        categoryId: homeCategory.id,
        stock: 35,
        price: 2100000.0,
      },
      {
        name: 'Xiaomi Robot Vacuum',
        code: 'HOM003',
        categoryId: homeCategory.id,
        stock: 12,
        price: 3500000.0,
      },
      // Additional products with 0 stock for testing
      {
        name: 'Samsung Galaxy S24 Ultra',
        code: 'ELC004',
        categoryId: electronicsCategory.id,
        stock: 0,
        price: 17000000.0,
      },
      {
        name: 'Adidas Ultraboost 22',
        code: 'FSH004',
        categoryId: fashionCategory.id,
        stock: 0,
        price: 2500000.0,
      },
    ];

    const productEntities = productRepository.create(products);
    await productRepository.save(productEntities);

    this.logger.log('✅ Products seeded successfully');
    this.logger.log(`📊 Created ${products.length} products`);

    // Log summary by category
    const electronicsCount = products.filter(
      (p) => p.categoryId === electronicsCategory.id,
    ).length;
    const fashionCount = products.filter(
      (p) => p.categoryId === fashionCategory.id,
    ).length;
    const homeCount = products.filter(
      (p) => p.categoryId === homeCategory.id,
    ).length;

    this.logger.log(`📱 Electronics: ${electronicsCount} products`);
    this.logger.log(`👕 Fashion: ${fashionCount} products`);
    this.logger.log(`🏠 Home & Living: ${homeCount} products`);
  }
}
