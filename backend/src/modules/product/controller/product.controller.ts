import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Query,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  FindProductQuery,
  ProductSortBy,
  SortOrder,
} from '../dto/queries/find-product.query';
import { ProductResponse } from '../dto/responses/product.response';
import { ProductWithPagingResponse } from '../dto/responses/product-with-paging.response';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product code already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponse> {
    const data = await this.productService.create(createProductDto);
    return {
      success: true,
      message: 'Product created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products with filtering, sorting, and pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by product name or code',
    example: 'Gaming Laptop',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ProductSortBy,
    description: 'Sort by field',
    example: ProductSortBy.CREATED_AT,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    description: 'Sort order',
    example: SortOrder.DESC,
  })
  @ApiQuery({
    name: 'categoryIds',
    required: false,
    description: 'Filter by category IDs (comma-separated)',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    description: 'Filter products in stock',
    example: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Product list retrieved successfully with filtering and pagination',
    type: ProductWithPagingResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No products found matching the criteria',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: FindProductQuery,
  ): Promise<ProductWithPagingResponse> {
    // Validate query ranges
    if (!query.isValid) {
      throw new BadRequestException('Invalid filter ranges provided');
    }

    const { data, total } = await this.productService.findAll(query);

    // Return 404 if no products found
    if (data.length === 0) {
      throw new NotFoundException('No products found matching the criteria');
    }

    const totalPage = Math.ceil(total / (query.limit || 10));

    return {
      success: true,
      message: 'Product list retrieved successfully',
      data,
      meta: {
        total,
        totalPage,
        currentPage: query.page || 1,
        limit: query.limit || 10,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductResponse> {
    const data = await this.productService.findOne(id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product by id' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: ProductResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product code already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    const data = await this.productService.update(id, updateProductDto);
    return {
      success: true,
      message: 'Product updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete product with stock > 0',
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message: string }> {
    await this.productService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
