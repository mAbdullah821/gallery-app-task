import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/helpers/prisma/prisma.service';
import { FileService } from 'src/helpers/file/service/file.service';
import { Image } from '@prisma/client';
import { IPaginatedResult } from '../common/interfaces/paginated-result.interface';
import { sanitizePaginationParams } from '../common/helpers/sanitize-pagination-params.helper';
import { GetImagesQueryDto } from '../common/dtos/get-images-query.dto';
import { MultipleImageUploadResponse } from '../common/responses/multiple-images-uploaded.response';

@Injectable()
export class ImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Uploads multiple images to Google Cloud Storage and stores metadata in database
   * @param files - Array of uploaded files
   * @param userId - ID of the user uploading the images
   * @returns Promise with upload results
   */
  async uploadMultipleImages(files: Express.Multer.File[], userId: string): Promise<MultipleImageUploadResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate all files
    const validation = this.validateAllFiles(files);
    if (!validation.valid) {
      throw new BadRequestException({
        message: 'File validation failed',
        errors: validation.errors,
      });
    }

    try {
      const uploadPromises = files.map((file) => this.processAndUploadImage(file, userId));
      const uploadedImages = await Promise.all(uploadPromises);

      return {
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} images`,
        data: uploadedImages,
        count: uploadedImages.length,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to upload images',
        error: error.message,
      });
    }
  }

  /**
   * Process and upload a single image
   * @param file - The file to upload
   * @param userId - ID of the user
   * @returns Promise with image upload result
   */
  private async processAndUploadImage(file: Express.Multer.File, userId: string): Promise<Image> {
    try {
      // Upload to Google Cloud Storage
      const uploadedFile = await this.fileService.uploadFile(file, 'images');

      // Store metadata in database
      const image = await this.prisma.image.create({
        data: {
          fileName: uploadedFile.fileName,
          publicURL: uploadedFile.publicURL,
          uploadedAt: new Date(uploadedFile.createdAt),
          contentType: uploadedFile.contentType,
          size: uploadedFile.size,
          userId: userId,
        },
      });

      return image;
    } catch (error) {
      throw new Error(`Failed to upload image ${file.originalname}: ${error.message}`);
    }
  }

  /**
   * Validate all uploaded files
   * @param files - Array of files to validate
   * @returns Validation result with errors if any
   */
  private validateAllFiles(files: Express.Multer.File[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    files.forEach((file, index) => {
      const isValidImageType = allowedMimeTypes.includes(file.mimetype);

      if (!isValidImageType) {
        errors.push(`File ${index + 1} (${file.originalname}) is not a valid image type`);
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errors.push(`File ${index + 1} (${file.originalname}) exceeds maximum size of 5MB`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get paginated images for a specific user with filters
   * @param userId - ID of the user
   * @param query - Query parameters for pagination and filtering
   * @returns Promise with paginated images
   */
  async findAllByUserPaginated(userId: string, query: GetImagesQueryDto): Promise<IPaginatedResult<Image>> {
    const { pageNumber, pageSize } = sanitizePaginationParams(query.pageNumber, query.pageSize);

    // Build where clause with filters
    const whereClause: any = {
      userId,
    };

    // Add date filters
    if (query.createdAfter || query.createdBefore) {
      whereClause.createdAt = {};

      if (query.createdAfter) {
        whereClause.createdAt.gte = new Date(query.createdAfter);
      }
      if (query.createdBefore) {
        whereClause.createdAt.lte = new Date(query.createdBefore);
      }
    }

    // Add size filters
    if (query.minSize || query.maxSize) {
      whereClause.size = {};
      if (query.minSize) {
        whereClause.size.gte = query.minSize;
      }
      if (query.maxSize) {
        whereClause.size.lte = query.maxSize;
      }
    }

    // Calculate skip for pagination
    const skip = (pageNumber - 1) * pageSize;

    // Execute queries in parallel
    const [images, totalItems] = await Promise.all([
      this.prisma.image.findMany({
        where: whereClause,
        orderBy: { uploadedAt: 'asc' }, // Always sort ascending by creation time
        skip,
        take: pageSize,
      }),
      this.prisma.image.count({
        where: whereClause,
      }),
    ]);

    return {
      pageNumber,
      pageSize,
      totalItems,
      data: images,
    };
  }

  /**
   * Get a specific image by ID and user
   * @param id - Image ID
   * @param userId - User ID
   * @returns Promise with image or null
   */
  async findById(id: string, userId: string): Promise<Image | null> {
    return this.prisma.image.findFirst({
      where: { id, userId },
    });
  }
}
