import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from './product-category.dto';

export class ProductDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'Gaming Laptop',
  })
  name: string;

  @ApiProperty({
    description: 'Product code',
    example: 'LPT001',
  })
  code: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Product category',
    type: ProductCategoryDto,
    required: false,
  })
  category?: ProductCategoryDto;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  stock: number;

  @ApiProperty({
    description: 'Product price',
    example: 15000000,
  })
  price: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
