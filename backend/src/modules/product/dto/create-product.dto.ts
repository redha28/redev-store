import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsAlphanumeric,
  MinLength,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name (minimum 3 characters)',
    example: 'Gaming Laptop',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Product code (unique, alphanumeric)',
    example: 'LPT001',
  })
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  code: string;

  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: 'Product stock (cannot be negative)',
    example: 10,
    minimum: 0,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  stock?: number = 0;

  @ApiProperty({
    description: 'Product price (must be greater than 0)',
    example: 15000000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  price: number;
}
