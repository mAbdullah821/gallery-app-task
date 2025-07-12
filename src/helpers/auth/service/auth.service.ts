import {
  HttpException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { hashString, verifyHash } from 'src/helpers/crypto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/helpers/prisma/prisma.service';
import { IAuthedUser, IJwtPayload, LoginDto, SignUpDto } from '../common';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a new user account with the provided signup credentials.
   *
   * @param signUpDto - An object containing the user's name, username and password.
   * @returns A promise that resolves to an `IAuthedUser` object containing the access token, refresh token, and user information.
   *
   * @throws ConflictException If a user with the provided username already exists.
   * @throws InternalServerErrorException If an unexpected error occurs during the signup process.
   */
  public async signup(signUpDto: SignUpDto): Promise<IAuthedUser> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { username: signUpDto.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }

      const hashedPassword = await hashString(signUpDto.password);

      const newUser = await this.prisma.user.create({
        data: {
          name: signUpDto.name,
          username: signUpDto.username,
          hashedPassword,
        },
      });

      const accessToken = await this.generateAccessToken(newUser.id);
      const refreshToken = await this.generateRefreshToken(newUser.id);

      const hashedRefreshToken = await hashString(refreshToken);

      await this.prisma.user.update({
        where: { id: newUser.id },
        data: { hashedRefreshToken },
      });

      return { accessToken, refreshToken, user: newUser };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('An unexpected error occurred during signup.');
    }
  }

  /**
   * Authenticates a user based on the provided login credentials.
   *
   * @param loginDto - An object containing the user's username and password.
   * @returns A promise that resolves to an `IAuthedUser` object containing the access token, refresh token, and user information.
   *
   * @throws UnauthorizedException If the provided credentials (password) do not match the user's stored password.
   * @throws InternalServerErrorException If an unexpected error occurs during the login process.
   * @throws ForbiddenException If the provided user has account is not active.
   */
  public async login(loginDto: LoginDto): Promise<IAuthedUser> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: loginDto.username },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isValidPassword = await verifyHash(loginDto.password, user.hashedPassword);

      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = await this.generateAccessToken(user.id);
      const refreshToken = await this.generateRefreshToken(user.id);

      const hashedRefreshToken = await hashString(refreshToken);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken },
      });

      return { accessToken, refreshToken, user };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('An unexpected error occurred during login.');
    }
  }
  // ...........................................................................................

  /**
   * Refreshes the authentication tokens (access and refresh) using a valid refresh token.
   *
   * @param currentUserJwt - An object containing the decoded information from the current refresh token, including the user ID and token value.
   * @returns A promise that resolves to a new `IAuthedUser` object with updated access and refresh tokens, and the user information.
   *
   * @throws UnauthorizedException If the provided refresh token is invalid or does not match the user's stored refresh token.
   * @throws InternalServerErrorException If an unexpected error occurs during the token refresh process.
   * @throws ForbiddenException If the provided user has account is not active.

   * @example
   * ```typescript
   * const newAuthResult = await this.authService.refreshToken({ id: 1});
   * console.log(newAuthResult.accessToken); // Output: "eyJhbGciOiJIUzI1Ni..." (new token)
   * ```
   */
  public async refreshTokens(currentUserJwt: IJwtPayload): Promise<IAuthedUser> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: currentUserJwt.id },
      });

      if (!user) {
        throw new UnauthorizedException('Account is not accessible');
      }

      if (!user.hashedRefreshToken) {
        throw new UnauthorizedException('No refresh token found, try to login first');
      }

      const isValidRefreshToken = await verifyHash(currentUserJwt.token, user.hashedRefreshToken);

      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Invalid Refresh Token');
      }

      const accessToken = await this.generateAccessToken(user.id);
      const refreshToken = await this.generateRefreshToken(user.id);

      const hashedRefreshToken = await hashString(refreshToken);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { hashedRefreshToken },
      });

      return { accessToken, refreshToken, user };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        console.error('Error during refresh token exchange:', err);
        throw new InternalServerErrorException('Failed to refresh token');
      }
    }
  }
  // ...........................................................................................

  /**
   * Generates a new access token for the given user ID.
   *
   * @private
   * @param userId - The ID of the user for whom to generate the token.
   * @returns A promise that resolves to the generated access token string.
   */
  private async generateAccessToken(userId: string): Promise<string> {
    const payload = {
      id: userId,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  /**
   * Generates a new refresh token for the given user ID.
   *
   * @private
   * @param userId - The ID of the user for whom to generate the token.
   * @returns A promise that resolves to the generated refresh token string.
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = {
      id: userId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });
  }
}
