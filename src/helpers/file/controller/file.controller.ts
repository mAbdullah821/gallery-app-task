import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileService } from './../service/file.service';
import { FileDto, GSObjectResponse, UploadedGSObject } from '../common';

@ApiBearerAuth()
@ApiTags('File Uploads')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Uploads a file to Google Cloud Storage and returns its metadata.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload payload',
    type: FileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: GSObjectResponse,
  })
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadedGSObject> {
    return this.fileService.uploadFile(file);
  }
}
