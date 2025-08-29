import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({
    description: 'Category unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Category name',
    example: 'Elektronik',
  })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic devices and gadgets',
  })
  description?: string;

  @ApiProperty({
    description: 'Category creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
