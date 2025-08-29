import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ProductCategorySeeder } from './product-category.seeder';
import { ProductSeeder } from './product.seeder';

export class DatabaseSeeder {
  private static readonly logger = new Logger('DatabaseSeeder');

  static async run(dataSource: DataSource): Promise<void> {
    try {
      this.logger.log('🌱 Starting database seeding...');

      // Run category seeder first (products depend on categories)
      this.logger.log('📁 Seeding product categories...');
      await ProductCategorySeeder.run(dataSource);

      // Run product seeder
      this.logger.log('📦 Seeding products...');
      await ProductSeeder.run(dataSource);

      this.logger.log('✅ Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error during database seeding:', error);
      throw error;
    }
  }
}
