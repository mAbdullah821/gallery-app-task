import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ImageService } from '../service/image.service';
import { GetCurrentUserId } from 'src/helpers/auth/common/decorators';
import { Image } from '@prisma/client';
import { GetImagesQueryDto, MultipleImageUploadResponse, UploadImagesBodyDto } from '../common';
import { GSObjectResponse } from 'src/helpers/file/common';
import { IPaginatedResult } from '../common/interfaces/paginated-result.interface';

@ApiTags('Images')
@Controller('images')
@ApiBearerAuth()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10)) // Max 10 files, field name 'images'
  @ApiOperation({
    summary: 'Upload multiple images',
    description:
      'Upload multiple image files to Google Cloud Storage. Supports JPEG, PNG, GIF, and WebP formats. Maximum 10 files, 5MB each.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple image files upload',
    type: UploadImagesBodyDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Images uploaded successfully',
    type: MultipleImageUploadResponse,
  })
  async uploadImages(
    @GetCurrentUserId() userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MultipleImageUploadResponse> {
    return this.imageService.uploadMultipleImages(files, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated images for the current user with filters',
    description:
      'Retrieve images with pagination support and optional filters for creation time and file size. Results are always sorted in ascending order by creation time.',
  })
  @ApiResponse({
    status: 200,
    description: 'Images retrieved successfully with pagination',
    type: MultipleImageUploadResponse,
  })
  async findAll(
    @GetCurrentUserId() userId: string,
    @Query() query: GetImagesQueryDto,
  ): Promise<IPaginatedResult<Image>> {
    return this.imageService.findAllByUserPaginated(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific image by ID' })
  @ApiResponse({
    status: 200,
    description: 'Image retrieved successfully',
    type: GSObjectResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found',
  })
  async findById(@Param('id') id: string, @GetCurrentUserId() userId: string): Promise<Image | null> {
    return this.imageService.findById(id, userId);
  }
}
