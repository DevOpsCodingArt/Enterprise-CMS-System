import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { RedisService } from '../redis/redis.service';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Default rate limit: 10 requests per 60 seconds
    const limit = options?.limit ?? 10;
    const ttl = options?.ttl ?? 60;

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const reply = httpContext.getResponse<FastifyReply>();

    // Extract client IP address from request (prioritize reverse proxy headers)
    const forwardedHeader = request.headers['x-forwarded-for'];
    const rawIp =
      (Array.isArray(forwardedHeader) ? forwardedHeader[0] : forwardedHeader) ||
      request.ip ||
      request.socket?.remoteAddress ||
      '127.0.0.1';
    const clientIp = rawIp.split(',')[0].trim();

    const path = request.url?.split('?')[0] || '/';
    const redisKey = `ratelimit:${path}:${clientIp}`;

    try {
      const redis = this.redisService.getClient();
      if (!redis || !this.redisService.isAvailable) {
        return true;
      }

      // Multi-command atomic pipeline: increment and set TTL if new
      const current = await redis.incr(redisKey);
      if (current === 1) {
        await redis.expire(redisKey, ttl);
      }

      if (current > limit) {
        const ttlRemaining = await redis.ttl(redisKey);
        const retrySeconds = ttlRemaining > 0 ? ttlRemaining : ttl;

        reply.header('Retry-After', retrySeconds.toString());
        reply.header('X-RateLimit-Limit', limit.toString());
        reply.header('X-RateLimit-Remaining', '0');

        this.logger.warn(
          `[RateLimit] IP ${clientIp} exceeded limit (${current}/${limit}) on ${path}. Blocked for ${retrySeconds}s.`,
        );

        throw new HttpException(
          {
            success: false,
            data: null,
            error: {
              code: 'TOO_MANY_REQUESTS',
              message: `Too many requests. Please wait ${retrySeconds} seconds before trying again.`,
              details: [
                `Quota of ${limit} requests per ${ttl}s exceeded for IP ${clientIp}`,
              ],
            },
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const remaining = Math.max(0, limit - current);
      reply.header('X-RateLimit-Limit', limit.toString());
      reply.header('X-RateLimit-Remaining', remaining.toString());

      return true;
    } catch (err: unknown) {
      // Re-throw HttpException if it is our 429 response
      if (err instanceof HttpException) {
        throw err;
      }

      // Redis Zero-Crash Policy: Fail open gracefully if Redis is down or reconnecting
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `[RateLimit] Redis unavailable (${msg}). Failing open for IP ${clientIp} on ${path}.`,
      );
      return true;
    }
  }
}
