import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  public isAvailable = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl =
      this.configService.get<string>('redis.url') ||
      process.env.REDIS_URL ||
      'redis://localhost:6379';

    try {
      this.client = new Redis(redisUrl, {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy: (times: number) => {
          // Exponential backoff, max 3 seconds delay
          const delay = Math.min(times * 200, 3000);
          return delay;
        },
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        this.logger.log('📡 Redis connection established.');
        this.isAvailable = true;
      });

      this.client.on('ready', () => {
        this.isAvailable = true;
      });

      this.client.on('error', (err: Error) => {
        if (this.isAvailable) {
          this.logger.warn(
            `⚠️ Redis error: ${err.message}. Falling back to PostgreSQL.`,
          );
        }
        this.isAvailable = false;
      });

      this.client.on('close', () => {
        this.isAvailable = false;
      });

      this.client.on('reconnecting', () => {
        this.logger.log('🔄 Reconnecting to Redis...');
      });

      // Attempt initial connection with a short timeout
      await Promise.race([
        this.client.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Redis connection timeout')), 2000),
        ),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `⚠️ Initial Redis connection failed: ${msg}. Proceeding with database fallback.`,
      );
      this.isAvailable = false;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
    }
  }

  /**
   * Get value from Redis or execute fallback function if Redis is offline/miss.
   */
  async getOrSet<T>(
    key: string,
    fetchFromDb: () => Promise<T>,
    ttlSeconds: number = 300,
  ): Promise<T> {
    if (this.isAvailable && this.client) {
      try {
        const cached = await this.client.get(key);
        if (cached !== null) {
          return JSON.parse(cached) as T;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Redis get failed for [${key}]: ${msg}`);
      }
    }

    // Execute fallback
    const result = await fetchFromDb();

    // Cache if Redis is available and result exists
    if (
      this.isAvailable &&
      this.client &&
      result !== null &&
      result !== undefined
    ) {
      try {
        await this.client.setex(key, ttlSeconds, JSON.stringify(result));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Redis setex failed for [${key}]: ${msg}`);
      }
    }

    return result;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isAvailable || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable || !this.client) return false;
    try {
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch {
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isAvailable || !this.client) return false;
    try {
      await this.client.del(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Redis Set operations for online presence
   */
  async addToSet(setName: string, member: string): Promise<boolean> {
    if (!this.isAvailable || !this.client) return false;
    try {
      await this.client.sadd(setName, member);
      return true;
    } catch {
      return false;
    }
  }

  async removeFromSet(setName: string, member: string): Promise<boolean> {
    if (!this.isAvailable || !this.client) return false;
    try {
      await this.client.srem(setName, member);
      return true;
    } catch {
      return false;
    }
  }

  async getSetMembers(setName: string): Promise<string[]> {
    if (!this.isAvailable || !this.client) return [];
    try {
      return await this.client.smembers(setName);
    } catch {
      return [];
    }
  }

  getClient(): Redis | null {
    return this.client;
  }
}
