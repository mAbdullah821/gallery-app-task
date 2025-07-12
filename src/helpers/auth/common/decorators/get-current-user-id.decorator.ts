import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the current user ID from the request context.
 * This custom parameter decorator retrieves the current user's ID from the request object.
 * It assumes the request object has a `user` property containing user information.
 * @returns {number} - The current user's ID extracted from the request.
 */

export const GetCurrentUserId = createParamDecorator(
  (data: any, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user.id;
  },
);
