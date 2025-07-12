import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadImagesBodyDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of image files to upload (max 10 files, 5MB each)',
    maxItems: 10,
  })
  images: Express.Multer.File[];
}