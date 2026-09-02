import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'secureredispass123',
  url: process.env.REDIS_URL || 'redis://:secureredispass123@localhost:6379',
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    // Exponential backoff, capped at 3000ms
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
}));
