import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class GSObjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'test.jpg' })
  fileName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'image/jpeg' })
  contentType: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, example: 204800 })
  size: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: 'https://example.com/imgs/test.jpg' })
  publicURL: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, example: '2024-08-17T12:34:56.000Z' })
  uploadedAt: string;
}
