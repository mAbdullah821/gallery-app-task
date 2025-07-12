import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class AuthedUserResponse {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp...',
    type: String,
    description: 'Access token',
  })
  accessToken: String;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp...',
    type: String,
    description: 'Refresh token',
  })
  refreshToken: String;

  @ApiProperty({
    type: UserResponse,
    description: 'User details',
  })
  user: UserResponse;
}
