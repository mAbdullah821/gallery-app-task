import { ApiProperty } from '@nestjs/swagger';

export class GSObjectResponse {
  @ApiProperty({ example: 'file id', description: 'id of the file' })
  id: string;

  @ApiProperty({ example: 'document.pdf', description: 'Name of the uploaded file' })
  fileName: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME type of the file' })
  contentType: string;

  @ApiProperty({ example: 204800, description: 'Size of the file in bytes' })
  size: number;

  @ApiProperty({
    example: 'https://storage.googleapis.com/bucket/document.pdf',
    description: 'Public URL to access the file',
  })
  publicURL: string;

  @ApiProperty({ example: '2024-08-17T12:34:56.000Z', description: 'Upload date and time in ISO format' })
  createdAt: string;

  @ApiProperty({ example: '2024-08-17T12:34:56.000Z', description: 'Upload date and time in ISO format' })
  updatedAt: string;
}
