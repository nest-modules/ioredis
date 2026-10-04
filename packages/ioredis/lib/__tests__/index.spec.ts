import * as publicApi from '../index';

describe('public API', () => {
  it('should expose the documented runtime exports', () => {
    expect(Object.keys(publicApi).sort()).toEqual(
      [
        'InjectRedis',
        'REDIS_HEALTH_INDICATOR',
        'REDIS_MODULE_CONNECTION',
        'REDIS_MODULE_CONNECTION_TOKEN',
        'REDIS_MODULE_OPTIONS_TOKEN',
        'RedisCoreModule',
        'RedisHealthIndicator',
        'RedisHealthModule',
        'RedisModule',
        'RedisTestModule',
        'createMockRedis',
        'createRedisConnection',
        'getRedisConnectionToken',
        'getRedisOptionsToken',
        'redisHealthIndicatorProvider',
      ].sort(),
    );
    for (const value of Object.values(publicApi)) {
      expect(value).toBeDefined();
    }
  });
});
