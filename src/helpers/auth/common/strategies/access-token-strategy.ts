import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/helpers/prisma/prisma.service';
import { IJwtPayload } from '../interfaces';
/**
 This strategy is responsible for validating the access token in the request header. 
 It extracts the token, decodes it using the provided secret key, and returns the decoded payload.
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private readonly prismaService: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET') as string,
      passReqToCallback: true, // To access the request object
    });
  }

  async validate(req: Request, payload: IJwtPayload) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new ForbiddenException('Access token malformed');
    }
    return {
      ...payload,
      token: accessToken,
    };
  }
}
