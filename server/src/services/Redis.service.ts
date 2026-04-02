import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from './ConfigService/Config.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name, { timestamp: true });
  private client: Redis;

  /**
   * Initializes the Redis client with configuration from ConfigService.
   * Sets up connection event handlers and retry strategy.
   * @param configService - Service for accessing configuration values
   */
  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000); // 2s Max
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Service Connected');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis Error: ', error);
    });
  }

  /**
   * Cleanup method called when the module is destroyed.
   * Closes the Redis connection gracefully.
   */
  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis Service Disconnected');
  }

  // ==== STRING OPERATIONS ====
  /**
   * Retrieves a value from Redis by key and deserializes it from JSON.
   * @param key - The Redis key to retrieve
   * @returns The deserialized value, or null if the key doesn't exist or parsing fails
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Error getting value from Redis: ', error);
      return null;
    }
  }

  /**
   * Sets a value in Redis with optional TTL (time-to-live).
   * The value is automatically serialized to JSON.
   * @param key - The Redis key to set
   * @param value - The value to store (will be JSON stringified)
   * @param ttl - Optional time-to-live in seconds
   * @throws Error if the operation fails
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialzed = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serialzed);
      } else {
        await this.client.set(key, serialzed);
      }
    } catch (error) {
      this.logger.error('Error setting value in Redis: ', error);
      throw error;
    }
  }

  //  ==== HASH OPERATIONS ===
  /**
   * Sets a single field-value pair in a Redis hash.
   * @param key - The Redis hash key
   * @param field - The field name within the hash
   * @param value - The value to set (objects are JSON stringified)
   */
  async hset(key: string, field: string, value: any): Promise<void>;
  /**
   * Sets multiple field-value pairs in a Redis hash at once.
   * @param key - The Redis hash key
   * @param data - An object containing field-value pairs to set
   */
  async hset(key: string, data: Record<string, any>): Promise<void>;
  /**
   * Sets field-value pair(s) in a Redis hash.
   * Supports both single field-value and bulk operations.
   * Objects are automatically serialized to JSON strings.
   * @param key - The Redis hash key
   * @param fieldOrData - Either a field name (string) or an object with multiple fields
   * @param value - The value to set (required if fieldOrData is a string)
   * @throws Error if the operation fails
   */
  async hset(
    key: string,
    fieldOrData: string | Record<string, any>,
    value?: any,
  ): Promise<void> {
    try {
      if (typeof fieldOrData === 'string') {
        const serialized =
          typeof value === 'object' ? JSON.stringify(value) : value;
        await this.client.hset(key, fieldOrData, serialized);
      } else {
        const serialized = Object.entries(fieldOrData).reduce(
          (acc, [k, v]) => {
            acc[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
            return acc;
          },
          {} as Record<string, string>,
        );
        await this.client.hset(key, serialized);
      }
    } catch (error) {
      this.logger.error('Error setting value in Redis: ', error);
      throw error;
    }
  }

  /**
   * Retrieves a single field value from a Redis hash.
   * Attempts to deserialize JSON values, falls back to raw string if parsing fails.
   * @param key - The Redis hash key
   * @param field - The field name to retrieve
   * @returns The deserialized value, or null if the field doesn't exist
   */
  async hget<T = string>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hget(key, field);
      if (!value) return null;

      // Try to parse the value as JSON fall back to raw value
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      this.logger.error('Error parsing value as JSON: ', error);
      return null;
    }
  }

  /**
   * Retrieves all field-value pairs from a Redis hash.
   * Automatically deserializes JSON values where possible.
   * @param key - The Redis hash key
   * @returns An object with all field-value pairs, or null if the hash doesn't exist or is empty
   */
  async hgetall<T = Record<string, any>>(key: string): Promise<T | null> {
    try {
      const data = await this.client.hgetall(key);
      if (Object.keys(data).length === 0) return null;

      const parsed = Object.entries(data).reduce(
        (acc, [k, v]) => {
          try {
            acc[k] = JSON.parse(v);
          } catch {
            acc[k] = v;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      return parsed as T;
    } catch (error) {
      this.logger.error('Error parsing value as JSON: ', error);
      return null;
    }
  }

  /**
   * Retrieves multiple field values from a Redis hash in a single operation.
   * Attempts to deserialize JSON values, falls back to raw strings if parsing fails.
   * @param key - The Redis hash key
   * @param fields - Variable number of field names to retrieve
   * @returns An array of values corresponding to the requested fields (null for non-existent fields)
   */
  async hmget<T = any>(
    key: string,
    ...fields: string[]
  ): Promise<(T | null)[]> {
    try {
      const values = await this.client.hmget(key, ...fields);
      return values.map((v) => {
        if (!v) return null;
        try {
          return JSON.parse(v) as T;
        } catch {
          return v as T;
        }
      });
    } catch (error) {
      this.logger.error('Error getting values from Redis: ', error);
      return fields.map(() => null);
    }
  }

  /**
   * Deletes one or more fields from a Redis hash.
   * @param key - The Redis hash key
   * @param fields - Variable number of field names to delete
   * @returns The number of fields that were removed
   * @throws Error if the operation fails
   */
  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.client.hdel(key, ...fields);
    } catch (error) {
      this.logger.error('Error deleting values from Redis: ', error);
      throw error;
    }
  }

  /**
   * Checks if a field exists in a Redis hash.
   * @param key - The Redis hash key
   * @param field - The field name to check
   * @returns True if the field exists, false otherwise
   */
  async hexists(key: string, field: string): Promise<boolean> {
    try {
      const result = await this.client.hexists(key, field);
      return result === 1;
    } catch (error) {
      this.logger.error('Error checking if value exists in Redis: ', error);
      return false;
    }
  }

  /**
   * Retrieves all field names from a Redis hash.
   * @param key - The Redis hash key
   * @returns An array of field names, or an empty array if the hash doesn't exist or on error
   */
  async hkeys(key: string): Promise<string[]> {
    try {
      return await this.client.hkeys(key);
    } catch (error) {
      this.logger.error('Error getting keys from Redis: ', error);
      return [];
    }
  }

  /**
   * Retrieves all field values from a Redis hash.
   * Automatically deserializes JSON values where possible.
   * @param key - The Redis hash key
   * @returns An array of all values in the hash, or an empty array if the hash doesn't exist or on error
   */
  async hvals(key: string): Promise<any[]> {
    try {
      const values = await this.client.hvals(key);
      return values.map((v) => {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      });
    } catch (error) {
      this.logger.error('Error getting values from Redis: ', error);
      return [];
    }
  }

  /**
   * Gets the number of fields in a Redis hash.
   * @param key - The Redis hash key
   * @returns The number of fields in the hash, or 0 if the hash doesn't exist or on error
   */
  async hlen(key: string): Promise<number> {
    try {
      return await this.client.hlen(key);
    } catch (error) {
      this.logger.error('Error getting length of hash from Redis: ', error);
      return 0;
    }
  }

  /**
   * Increments a numeric field value in a Redis hash by the specified integer amount.
   * If the field doesn't exist, it is initialized to 0 before incrementing.
   * @param key - The Redis hash key
   * @param field - The field name to increment
   * @param increment - The amount to increment by (default: 1)
   * @returns The new value after incrementing
   * @throws Error if the operation fails
   */
  async hincrby(
    key: string,
    field: string,
    increment: number = 1,
  ): Promise<number> {
    try {
      return await this.client.hincrby(key, field, increment);
    } catch (error) {
      this.logger.error('Error incrementing value in Redis: ', error);
      throw error;
    }
  }

  /**
   * Increments a numeric field value in a Redis hash by the specified float amount.
   * If the field doesn't exist, it is initialized to 0 before incrementing.
   * @param key - The Redis hash key
   * @param field - The field name to increment
   * @param increment - The float amount to increment by (default: 1.0)
   * @returns The new value after incrementing as a float
   * @throws Error if the operation fails
   */
  async hincrbyfloat(
    key: string,
    field: string,
    increment: number = 1.0,
  ): Promise<number> {
    try {
      const result = await this.client.hincrbyfloat(key, field, increment);
      return parseFloat(result);
    } catch (error) {
      this.logger.error('Error incrementing value in Redis: ', error);
      throw error;
    }
  }

  // ==== SORTED SET OPERATIONS ====
  /**
   * Adds one or more members to a sorted set, or updates their score if they already exist.
   * Score-members pairs should be provided as alternating score and member values.
   * @param key - The Redis sorted set key
   * @param scoreMembers - Alternating score and member pairs (e.g., score1, member1, score2, member2)
   * @returns The number of elements added to the sorted set (not including elements updated)
   * @throws Error if the operation fails
   */
  async zadd(
    key: string,
    ...scoreMembers: (number | string)[]
  ): Promise<number> {
    try {
      return await this.client.zadd(key, ...scoreMembers);
    } catch (error) {
      this.logger.error('Error adding value to sorted set in Redis: ', error);
      throw error;
    }
  }

  /**
   * Returns members in a sorted set within the specified index range, ordered from lowest to highest score.
   * @param key - The Redis sorted set key
   * @param start - The start index (0-based, inclusive)
   * @param stop - The stop index (0-based, inclusive). Use -1 for the last element
   * @param withScores - If true, returns members with their scores as alternating values (default: false)
   * @returns An array of members, or members with scores if withScores is true. Returns empty array on error
   */
  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrange(key, start, stop);
    } catch (error) {
      this.logger.error(
        'Error getting values from sorted set in Redis: ',
        error,
      );
      return [];
    }
  }

  /**
   * Returns members in a sorted set within the specified score range, ordered from lowest to highest score.
   * Use "-inf" and "+inf" for unbounded ranges, or prefix with "(" for exclusive ranges.
   * @param key - The Redis sorted set key
   * @param min - The minimum score (inclusive) or "-inf" for unbounded
   * @param max - The maximum score (inclusive) or "+inf" for unbounded
   * @param withScores - If true, returns members with their scores as alternating values (default: false)
   * @returns An array of members, or members with scores if withScores is true. Returns empty array on error
   */
  async zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    withScores: boolean = false,
  ): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrangebyscore(key, min, max, 'WITHSCORES');
      }
      return await this.client.zrangebyscore(key, min, max);
    } catch (error) {
      this.logger.error(
        'Error getting values from sorted set in Redis: ',
        error,
      );
      return [];
    }
  }

  /**
   * Returns members in a sorted set within the specified index range, ordered from highest to lowest score.
   * @param key - The Redis sorted set key
   * @param start - The start index (0-based, inclusive)
   * @param stop - The stop index (0-based, inclusive). Use -1 for the last element
   * @param withScores - If true, returns members with their scores as alternating values (default: false)
   * @returns An array of members, or members with scores if withScores is true. Returns empty array on error
   */
  async zrevrange(
    key: string,
    start: number,
    stop: number,
    withScores: boolean = false,
  ): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrevrange(key, start, stop, 'WITHSCORES');
      }
      return await this.client.zrevrange(key, start, stop);
    } catch (error) {
      this.logger.error(
        'Error getting values from sorted set in Redis: ',
        error,
      );
      return [];
    }
  }
  /**
   * Returns members in a sorted set within the specified score range, ordered from highest to lowest score.
   * Use "-inf" and "+inf" for unbounded ranges, or prefix with "(" for exclusive ranges.
   * Note: max comes before min in the parameter order (reverse of zrangebyscore).
   * @param key - The Redis sorted set key
   * @param max - The maximum score (inclusive) or "+inf" for unbounded
   * @param min - The minimum score (inclusive) or "-inf" for unbounded
   * @param withScores - If true, returns members with their scores as alternating values (default: false)
   * @returns An array of members, or members with scores if withScores is true. Returns empty array on error
   */
  async zrevrangebyscore(
    key: string,
    max: number | string,
    min: number | string,
    withScores: boolean = false,
  ): Promise<string[]> {
    try {
      if (withScores) {
        return await this.client.zrevrangebyscore(key, max, min, 'WITHSCORES');
      }
      return await this.client.zrevrangebyscore(key, max, min);
    } catch (error) {
      this.logger.error(
        'Error getting reverse range by score from sorted set in Redis: ',
        error,
      );
      return [];
    }
  }

  /**
   * Returns the rank (0-based index) of a member in a sorted set, ordered from lowest to highest score.
   * @param key - The Redis sorted set key
   * @param member - The member to get the rank for
   * @returns The rank of the member, or null if the member doesn't exist or on error
   */
  async zrank(key: string, member: string): Promise<number | null> {
    try {
      return await this.client.zrank(key, member);
    } catch (error) {
      this.logger.error('Error getting rank from sorted set in Redis: ', error);
      return null;
    }
  }

  /**
   * Returns the rank (0-based index) of a member in a sorted set, ordered from highest to lowest score.
   * @param key - The Redis sorted set key
   * @param member - The member to get the reverse rank for
   * @returns The reverse rank of the member, or null if the member doesn't exist or on error
   */
  async zrevrank(key: string, member: string): Promise<number | null> {
    try {
      return await this.client.zrevrank(key, member);
    } catch (error) {
      this.logger.error(
        'Error getting reverse rank from sorted set in Redis: ',
        error,
      );
      return null;
    }
  }

  /**
   * Returns the score of a member in a sorted set.
   * @param key - The Redis sorted set key
   * @param member - The member to get the score for
   * @returns The score of the member as a number, or null if the member doesn't exist or on error
   */
  async zscore(key: string, member: string): Promise<number | null> {
    try {
      const score = await this.client.zscore(key, member);
      return score ? parseFloat(score) : null;
    } catch (error) {
      this.logger.error(
        'Error getting score from sorted set in Redis: ',
        error,
      );
      return null;
    }
  }

  /**
   * Increments the score of a member in a sorted set by the specified amount.
   * If the member doesn't exist, it is added with the increment as its initial score.
   * @param key - The Redis sorted set key
   * @param increment - The amount to increment the score by (can be negative to decrement)
   * @param member - The member whose score to increment
   * @returns The new score of the member after incrementing
   * @throws Error if the operation fails
   */
  async zincrby(
    key: string,
    increment: number,
    member: string,
  ): Promise<number> {
    try {
      const result = await this.client.zincrby(key, increment, member);
      return parseFloat(result);
    } catch (error) {
      this.logger.error(
        'Error incrementing score in sorted set in Redis: ',
        error,
      );
      throw error;
    }
  }

  /**
   * Removes one or more members from a sorted set.
   * @param key - The Redis sorted set key
   * @param members - Variable number of member names to remove
   * @returns The number of members removed (not including non-existent members)
   * @throws Error if the operation fails
   */
  async zrem(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.zrem(key, ...members);
    } catch (error) {
      this.logger.error('Error removing from sorted set in Redis: ', error);
      throw error;
    }
  }

  /**
   * Removes all members in a sorted set within the specified rank range.
   * @param key - The Redis sorted set key
   * @param start - The start rank (0-based, inclusive)
   * @param stop - The stop rank (0-based, inclusive). Use -1 for the last element
   * @returns The number of members removed
   * @throws Error if the operation fails
   */
  async zremrangebyrank(
    key: string,
    start: number,
    stop: number,
  ): Promise<number> {
    try {
      return await this.client.zremrangebyrank(key, start, stop);
    } catch (error) {
      this.logger.error(
        'Error removing range by rank from sorted set in Redis: ',
        error,
      );
      throw error;
    }
  }

  /**
   * Removes all members in a sorted set within the specified score range.
   * Use "-inf" and "+inf" for unbounded ranges, or prefix with "(" for exclusive ranges.
   * @param key - The Redis sorted set key
   * @param min - The minimum score (inclusive) or "-inf" for unbounded
   * @param max - The maximum score (inclusive) or "+inf" for unbounded
   * @returns The number of members removed
   * @throws Error if the operation fails
   */
  async zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    try {
      return await this.client.zremrangebyscore(key, min, max);
    } catch (error) {
      this.logger.error(
        'Error removing range by score from sorted set in Redis: ',
        error,
      );
      throw error;
    }
  }

  /**
   * Returns the number of members (cardinality) in a sorted set.
   * @param key - The Redis sorted set key
   * @returns The number of members in the sorted set, or 0 if the set doesn't exist or on error
   */
  async zcard(key: string): Promise<number> {
    try {
      return await this.client.zcard(key);
    } catch (error) {
      this.logger.error('Error getting sorted set size in Redis: ', error);
      return 0;
    }
  }

  /**
   * Counts the number of members in a sorted set with scores within the specified range.
   * Use "-inf" and "+inf" for unbounded ranges, or prefix with "(" for exclusive ranges.
   * @param key - The Redis sorted set key
   * @param min - The minimum score (inclusive) or "-inf" for unbounded
   * @param max - The maximum score (inclusive) or "+inf" for unbounded
   * @returns The number of members with scores in the specified range, or 0 on error
   */
  async zcount(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    try {
      return await this.client.zcount(key, min, max);
    } catch (error) {
      this.logger.error(
        'Error counting members in score range in Redis: ',
        error,
      );
      return 0;
    }
  }

  /**
   * Deletes a key from Redis.
   * @param key - The Redis key to delete
   * @throws Error if the operation fails
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error('Error deleting value from Redis: ', error);
      throw error;
    }
  }

  // ==== KEY OPERATIONS ====
  /**
   * Deletes all keys matching the specified pattern.
   * Note: Using KEYS command can be slow on large databases. Consider using SCAN for production.
   * @param pattern - The pattern to match keys (e.g., "user:*" or "session:?")
   * @throws Error if the operation fails
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error('Error deleting values from Redis: ', error);
      throw error;
    }
  }

  /**
   * Checks if a key exists in Redis.
   * @param key - The Redis key to check
   * @returns True if the key exists, false otherwise
   * @throws Error if the operation fails
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error('Error checking if value exists in Redis: ', error);
      throw error;
    }
  }

  /**
   * Sets a time-to-live (TTL) on a key in seconds.
   * @param key - The Redis key to set expiration on
   * @param ttl - Time-to-live in seconds
   * @throws Error if the operation fails
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      this.logger.error('Error expiring value in Redis: ', error);
      throw error;
    }
  }

  /**
   * Gets the remaining time-to-live (TTL) of a key in seconds.
   * @param key - The Redis key to check
   * @returns The remaining TTL in seconds, -1 if the key exists but has no expiration, -2 if the key doesn't exist, or -1 on error
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increments a numeric key value by the specified integer amount.
   * If the key doesn't exist, it is initialized to 0 before incrementing.
   * @param key - The Redis key to increment
   * @param amount - The amount to increment by (default: 1)
   * @returns The new value after incrementing
   * @throws Error if the operation fails
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Decrements a numeric key value by the specified integer amount.
   * If the key doesn't exist, it is initialized to 0 before decrementing.
   * @param key - The Redis key to decrement
   * @param amount - The amount to decrement by (default: 1)
   * @returns The new value after decrementing
   * @throws Error if the operation fails
   */
  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.client.decrby(key, amount);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves all keys matching the specified pattern.
   * Note: Using KEYS command can be slow on large databases. Consider using SCAN for production.
   * @param pattern - The pattern to match keys (e.g., "user:*" or "session:?")
   * @returns An array of matching keys, or an empty array if none match or on error
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys for pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Flushes (deletes) all keys in the current Redis database.
   * Warning: This is a destructive operation that cannot be undone.
   * @throws Error if the operation fails
   */
  async flushDb(): Promise<void> {
    try {
      await this.client.flushdb();
      this.logger.warn('Redis database flushed');
    } catch (error) {
      this.logger.error('Error flushing database:', error);
      throw error;
    }
  }

  /**
   * Returns the underlying Redis client instance.
   * Use this method when you need direct access to Redis commands not wrapped by this service.
   * @returns The ioredis Redis client instance
   */
  getClient(): Redis {
    return this.client;
  }
}
