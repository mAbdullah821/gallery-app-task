import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsDateString, IsNumber } from 'class-validator';

export class GetImagesQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({
    description: 'Filter images created after this date (ISO 8601 format)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter images created before this date (ISO 8601 format)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter images with minimum size in bytes',
    minimum: 0,
    example: 1024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minSize?: number;

  @ApiPropertyOptional({
    description: 'Filter images with maximum size in bytes',
    minimum: 0,
    example: 5242880,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSize?: number;
}
