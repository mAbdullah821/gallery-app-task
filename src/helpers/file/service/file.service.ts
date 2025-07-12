import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadedGSObject } from '../common';
import { Bucket, Storage } from '@google-cloud/storage';

@Injectable()
export class FileService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly bucket: Bucket;

  constructor(private readonly configService: ConfigService) {
    this.storage = new Storage();
    this.bucketName = this.configService.get<string>('FILES_BUCKET_NAME') as string;
    this.bucket = this.storage.bucket(this.bucketName);
  }
  //.......................................................................................................................................
  /**
   * Uploads a file to Google Cloud Storage under an optional destination prefix.
   *
   * This method stores the uploaded file in the configured GCS bucket with metadata,
   * generating a destination path based on the current timestamp and original file name.
   * It replaces spaces in the path with underscores to ensure compatibility.
   *
   * @param file - The file to be uploaded (typically from a Multer middleware).
   * @param prefix - (Optional) A custom directory prefix for the destination path.
   *                 Defaults to `'default'` if not provided.
   *
   * @returns A promise that resolves to an `UploadedGSObject` containing file metadata.
   *
   * @throws {BadRequestException} If no file is provided.
   * @throws {InternalServerErrorException} If the upload fails due to an internal error.
   *
   * @example
   * ```ts
   * const uploaded = await fileService.uploadFile(file, 'temp');
   * console.log(uploaded.path); // e.g., "temp/invoice_1716912641000.xlsx"
   * ```
   */
  public async uploadFile(file: Express.Multer.File, prefix: string = 'default'): Promise<UploadedGSObject> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided for upload.');
      }

      const metadata = {
        cacheControl: 'no-store, max-age=0',
        contentType: file.mimetype,
        metadata: { prefix: file.originalname },
      };

      const destinationPath = `${prefix}/${file.originalname}_${Date.now()}`.replaceAll(' ', '_');

      await this.bucket.file(destinationPath).save(file.buffer, { metadata });

      return new UploadedGSObject(this.bucketName, destinationPath, file);
    } catch (err) {
      console.error('Failed to upload file to Google Cloud Storage', {
        error: err?.message,
        fileName: file?.originalname,
      });

      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException('Failed to upload file. Please try again later.');
    }
  }
}
