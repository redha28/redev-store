import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  getClient(): Redis {
    return this.redisClient;
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(
    key: string,
    value: string,
    expireSeconds?: number,
  ): Promise<'OK' | null> {
    if (expireSeconds) {
      return this.redisClient.set(key, value, 'EX', expireSeconds);
    }
    return this.redisClient.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  /**
   * Delete all keys matching a pattern (wildcard)
   */
  async deleteByPattern(pattern: string): Promise<void> {
    let keys: string[] = [];
    try {
      const found = await this.redisClient.keys(pattern);
      if (Array.isArray(found)) {
        keys = found;
      }
    } catch (e) {
      // ignore redis error
    }
    if (keys && keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }

  /**
   * Generate a consistent cache key for any object
   */
  getCacheKey(prefix: string, obj?: any): string {
    return `${prefix}:${Buffer.from(JSON.stringify(obj || {})).toString('base64')}`;
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
