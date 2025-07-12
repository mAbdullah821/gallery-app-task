import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    example: 'ckr0vjk9l0001qzrmqz2n2c3x',
    type: String,
    description: 'ID of the user',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    type: String,
    description: 'Name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'john_doe',
    type: String,
    description: 'Username of the user',
  })
  username: string;

  @ApiProperty({
    example: '2023-11-22T10:30:00.000Z',
    type: Date,
    description: 'Date and time when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-11-23T15:45:00.000Z',
    type: Date,
    description: 'Date and time when the user was last updated',
  })
  updatedAt: Date;
}
