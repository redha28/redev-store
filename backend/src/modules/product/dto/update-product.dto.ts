import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsAlphanumeric,
  MinLength,
  Min,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name (minimum 3 characters)',
    example: 'Gaming Laptop',
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    description: 'Product code (unique, alphanumeric)',
    example: 'LPT001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  code?: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @ApiProperty({
    description: 'Product stock (cannot be negative)',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({
    description: 'Product price (must be greater than 0)',
    example: 15000000,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;
}
