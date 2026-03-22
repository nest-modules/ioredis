import { DynamicModule, Module } from '@nestjs/common';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

const MOCK_REDIS_METHODS = [
  'get',
  'set',
  'del',
  'exists',
  'expire',
  'ttl',
  'keys',
  'hget',
  'hset',
  'hdel',
  'hgetall',
  'lpush',
  'rpush',
  'lpop',
  'rpop',
  'lrange',
  'sadd',
  'srem',
  'smembers',
  'sismember',
  'zadd',
  'zrem',
  'zrange',
  'zrangebyscore',
  'publish',
  'subscribe',
  'ping',
  'quit',
  'info',
  'flushdb',
  'flushall',
  'multi',
  'exec',
  'pipeline',
  'mget',
  'mset',
  'incr',
  'decr',
  'incrby',
  'decrby',
  'scan',
  'hscan',
  'sscan',
  'zscan',
] as const;

export type MockRedis = Record<(typeof MOCK_REDIS_METHODS)[number], jest.Mock>;

function createMockRedis(overrides?: Partial<MockRedis>): MockRedis {
  const mock = {} as MockRedis;
  for (const method of MOCK_REDIS_METHODS) {
    mock[method] = jest.fn();
  }
  if (overrides) {
    Object.assign(mock, overrides);
  }
  return mock;
}

/**
 * A testing module that provides a mock Redis connection.
 *
 * Usage:
 * ```ts
 * const module = await Test.createTestingModule({
 *   imports: [RedisTestModule.forTest()],
 *   providers: [MyService],
 * }).compile();
 *
 * const redis = module.get<MockRedis>(getRedisConnectionToken());
 * redis.get.mockResolvedValue('value');
 * ```
 */
@Module({})
export class RedisTestModule {
  static forTest(
    connection?: string,
    overrides?: Partial<MockRedis>,
  ): DynamicModule {
    const token = getRedisConnectionToken(connection);
    const mockRedis = createMockRedis(overrides);

    return {
      module: RedisTestModule,
      global: true,
      providers: [
        {
          provide: token,
          useValue: mockRedis,
        },
      ],
      exports: [token],
    };
  }
}

export { createMockRedis };
