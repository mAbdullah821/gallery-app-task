import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './common';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
