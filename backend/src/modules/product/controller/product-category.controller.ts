import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategoryDto } from '../dto/product-category.dto';

@ApiTags('Product Categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [ProductCategoryDto],
  })
  @Get()
  async findAll(): Promise<{
    success: boolean;
    message: string;
    data: ProductCategoryDto[];
  }> {
    const categories = await this.productCategoryService.findAll();

    return {
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }
}
