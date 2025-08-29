import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../product.dto';
import { PaginationMetaDto } from '../../../../@core/dto/paginationMeta.dto';

export class ProductWithPagingResponse {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product list retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Product data array',
    type: [ProductDto],
  })
  data: ProductDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
