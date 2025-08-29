import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum ProductSortBy {
  ID = 'id',
  NAME = 'name',
  CODE = 'code',
  PRICE = 'price',
  STOCK = 'stock',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Helper function to transform string to boolean
const transformToBoolean = ({ value }: { value: any }) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
};

// Helper function to split string by comma
const splitString = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export class FindProductQuery {
  @ApiProperty({
    type: 'number',
    required: false,
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    type: 'number',
    required: false,
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Search term for filtering products by name or code',
    example: 'Gaming Laptop',
  })
  @IsString({ message: 'Search must be a string' })
  @IsOptional()
  search?: string;

  @ApiProperty({
    enum: ProductSortBy,
    required: false,
    description: 'Sort by field',
    default: ProductSortBy.CREATED_AT,
  })
  @IsEnum(ProductSortBy, { message: 'Invalid sort field' })
  @IsOptional()
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

  @ApiProperty({
    enum: SortOrder,
    required: false,
    description: 'Sort order',
    default: SortOrder.DESC,
  })
  @IsEnum(SortOrder, { message: 'Sort order must be ASC or DESC' })
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Category IDs, separated by comma',
    example: '1,2,3',
  })
  @IsString({ message: 'Category IDs must be a string' })
  @IsOptional()
  categoryIds?: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    description: 'Filter products that are in stock (stock > 0)',
    default: false,
  })
  @IsBoolean({ message: 'In stock must be a boolean' })
  @Transform(transformToBoolean)
  @IsOptional()
  inStock?: boolean;

  // Getter methods for parsing comma-separated values
  get categoryIdList(): number[] {
    if (!this.categoryIds) return [];
    return splitString(this.categoryIds)
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));
  }

  // Helper method to get offset for pagination
  get offset(): number {
    return (this.page! - 1) * this.limit!;
  }

  // Simplified validation - always valid since we removed complex range validations
  get isValid(): boolean {
    return true;
  }
}
