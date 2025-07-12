import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './helpers/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './helpers/auth/common';

@Module({
  imports: [AuthModule, ImageModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
