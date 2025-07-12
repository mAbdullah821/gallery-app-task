import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/helpers/prisma/prisma.service';
import { IJwtPayload } from '../interfaces';
/**
 This strategy is responsible for validating the refresh token in the request header. 
 It extracts the token, decodes it using the provided secret key, and returns the decoded payload and the refresh token .
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET') as string,
      passReqToCallback: true, // To access the request object
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }
    return {
      ...payload,
      token: refreshToken,
    };
  }
}
