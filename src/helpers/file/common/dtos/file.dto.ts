import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file',
  })
  file: Express.Multer.File;
}
