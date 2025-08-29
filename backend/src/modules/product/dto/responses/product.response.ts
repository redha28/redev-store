import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../product.dto';

export class ProductResponse {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Product retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Product data',
    type: ProductDto,
  })
  data: ProductDto;
}
