import { Test } from '@nestjs/testing';
import Redis from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../constants';
import { RedisHealthIndicator } from '../health/redis-health.indicator';
import { RedisHealthModule } from '../health/redis-health.module';
import { redisHealthIndicatorProvider } from '../health/redis-health.provider';
import { RedisModule } from '../modules/redis.module';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

describe('RedisHealthModule', () => {
  it('should inject the default Redis connection into the indicator', async () => {
    const module = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          options: { lazyConnect: true },
        }),
        RedisHealthModule,
      ],
    }).compile();

    const connection = module.get<Redis>(getRedisConnectionToken());
    const ping = jest.spyOn(connection, 'ping').mockResolvedValue('PONG');
    jest.spyOn(connection, 'quit').mockResolvedValue('OK');

    const indicator = module.get(RedisHealthIndicator);
    await expect(indicator.isHealthy('redis')).resolves.toEqual({
      redis: { status: 'up' },
    });
    expect(ping).toHaveBeenCalledTimes(1);

    const app = module.createNestApplication();
    await app.init();
    await app.close();
  });
});

describe('redisHealthIndicatorProvider', () => {
  it('should bridge the default connection to the health indicator token', () => {
    expect(redisHealthIndicatorProvider.provide).toBe(REDIS_HEALTH_INDICATOR);
    expect(redisHealthIndicatorProvider.inject).toEqual([
      getRedisConnectionToken(),
    ]);

    const redis = {} as Redis;
    expect(redisHealthIndicatorProvider.useFactory(redis)).toBe(redis);
  });
});
