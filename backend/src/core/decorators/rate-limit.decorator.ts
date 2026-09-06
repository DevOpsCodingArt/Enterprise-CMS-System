import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_KEY = 'rate_limit_options';

export interface RateLimitOptions {
  limit?: number; // Maximum number of requests allowed in window (default: 10)
  ttl?: number; // Sliding window size in seconds (default: 60s)
}

export const RateLimit = (options?: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options ?? { limit: 10, ttl: 60 });
