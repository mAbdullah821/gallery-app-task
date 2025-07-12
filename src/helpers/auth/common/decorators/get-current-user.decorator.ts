import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IJwtPayload } from '../interfaces';

/**
 * Retrieves the currently authenticated user from the request context.
 * This decorator extracts the user information from the JWT token included in the request.
 * @returns The currently authenticated user object, as extracted from the JWT token.
 */
export const GetCurrentUser = createParamDecorator((data: any, context: ExecutionContext): IJwtPayload => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
