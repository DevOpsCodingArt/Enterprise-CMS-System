import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to bypass global JWT authentication guards for public endpoints.
 * Example: `@Public()` on Login, Register, Health endpoints.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
