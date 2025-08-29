import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationMetaDto {
  @ApiProperty({
    type: 'number',
    description: 'Total number of items',
  })
  total: number;

  @ApiProperty({
    type: 'number',
    description: 'Total number of page',
  })
  totalPage: number;

  @ApiProperty({
    type: 'number',
    description: 'Current page number',
  })
  currentPage: number;

  @ApiProperty({
    type: 'number',
    description: 'Number of items per page',
  })
  limit: number;
}
