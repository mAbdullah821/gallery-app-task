import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './helpers/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { HelpersModule } from './helpers/helpers.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './helpers/auth/common';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HelpersModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
