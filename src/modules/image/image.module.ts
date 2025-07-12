import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './service/image.service';
import { ImageController } from './controller/image.controller';
import { FileModule } from 'src/helpers/file/file.module';
import { AuthModule } from 'src/helpers/auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 10, // Max 10 files
      },
    }),
    FileModule,
    AuthModule,
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
