import { User } from '@prisma/client';

export interface IAuthedUser {
  accessToken: String;
  refreshToken: String;
  user: User;
}
