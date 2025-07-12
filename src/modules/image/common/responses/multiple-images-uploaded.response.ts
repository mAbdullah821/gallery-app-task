import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';
import { GSObjectResponse } from 'src/helpers/file/common';

export class MultipleImageUploadResponse {
  @ApiProperty({
    description: 'Indicates if the upload operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message about the upload result',
    example: 'Successfully uploaded 3 images',
  })
  message: string;

  @ApiProperty({
    description: 'Array of uploaded image metadata',
    type: [GSObjectResponse],
  })
  data: Image[];

  @ApiProperty({
    description: 'Total number of images uploaded',
    example: 3,
  })
  count: number;
}
