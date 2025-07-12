import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The username used for login authentication.',
    example: 'john_doe',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The user's password for authentication.",
    example: 'securePassword123',
  })
  password: string;
}
