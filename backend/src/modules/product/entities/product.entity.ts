import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from './product-category.entity';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Product name (minimum 3 characters)',
    example: 'Gaming Laptop',
  })
  @Column({ name: 'name', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Product code (unique, alphanumeric)',
    example: 'LPT001',
  })
  @Column({ name: 'code', unique: true, length: 50 })
  code: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @Column({ name: 'category_id' })
  categoryId: number;

  @ApiProperty({
    description: 'Product category',
    type: () => ProductCategory,
  })
  @ManyToOne(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @ApiProperty({
    description: 'Product stock (cannot be negative)',
    example: 10,
    minimum: 0,
  })
  @Column({ name: 'stock', default: 0 })
  stock: number;

  @ApiProperty({
    description: 'Product price (must be greater than 0)',
    example: 15000000,
    minimum: 1,
  })
  @Column({ name: 'price', type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
