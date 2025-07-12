import { AuthService } from '../service/auth.service';
import { Body, Controller, HttpCode, HttpStatus, UseGuards, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetCurrentUser,
  IAuthedUser,
  IJwtPayload,
  LoginDto,
  SignUpDto,
  Public,
  RefreshTokenGuard,
  AuthedUserResponse,
} from '../common';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user account',
    description: 'Create a new user account with username and password.',
  })
  @ApiOkResponse({
    type: AuthedUserResponse,
  })
  async signup(@Body() signUpDto: SignUpDto): Promise<IAuthedUser> {
    return this.authService.signup(signUpDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with username and password',
    description: 'Login with username and password to get access token and refresh token.',
  })
  @ApiOkResponse({
    type: AuthedUserResponse,
  })
  async login(@Body() loginDto: LoginDto): Promise<IAuthedUser> {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @ApiBearerAuth()
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AuthedUserResponse,
  })
  @ApiOperation({
    summary: 'Refresh tokens using refresh token',
    description: 'Renews access tokens and refresh token securely using refresh token.',
  })
  async refreshTokens(@GetCurrentUser() user: IJwtPayload): Promise<IAuthedUser> {
    return this.authService.refreshTokens(user);
  }
}
