import { HealthIndicatorService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { REDIS_HEALTH_INDICATOR } from '../constants';
import { RedisHealthIndicator } from '../health/redis-health.indicator';

describe('RedisHealthIndicator', () => {
  let indicator: RedisHealthIndicator;
  let mockRedis: { ping: jest.Mock };

  beforeEach(async () => {
    mockRedis = {
      ping: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisHealthIndicator,
        HealthIndicatorService,
        {
          provide: REDIS_HEALTH_INDICATOR,
          useValue: mockRedis,
        },
      ],
    }).compile();

    indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
  });

  it('should be defined', () => {
    expect(indicator).toBeDefined();
  });

  describe('isHealthy', () => {
    it('should return healthy status when ping succeeds', async () => {
      mockRedis.ping.mockResolvedValue('PONG');

      const result = await indicator.isHealthy('redis');

      expect(result).toEqual({ redis: { status: 'up' } });
      expect(mockRedis.ping).toHaveBeenCalledTimes(1);
    });

    it('should return down status when ping fails', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection refused'));

      const result = await indicator.isHealthy('redis');

      expect(result).toEqual({
        redis: {
          status: 'down',
          message: 'Connection refused',
        },
      });
    });

    it('should include error message in down result', async () => {
      mockRedis.ping.mockRejectedValue(new Error('ECONNREFUSED'));

      const result = await indicator.isHealthy('redis');

      expect(result).toEqual({
        redis: {
          status: 'down',
          message: 'ECONNREFUSED',
        },
      });
    });

    it('should handle non-Error thrown values gracefully', async () => {
      mockRedis.ping.mockRejectedValue('string error');

      const result = await indicator.isHealthy('redis');

      expect(result).toEqual({
        redis: {
          status: 'down',
          message: 'Unknown error',
        },
      });
    });

    it('should use custom key name in result', async () => {
      mockRedis.ping.mockResolvedValue('PONG');

      const result = await indicator.isHealthy('my-redis-cache');

      expect(result).toEqual({
        'my-redis-cache': { status: 'up' },
      });
    });

    it('should accept an explicit connection for named connections', async () => {
      const namedRedis = { ping: jest.fn().mockResolvedValue('PONG') };

      const result = await indicator.isHealthy('cache', namedRedis as any);

      expect(result).toEqual({ cache: { status: 'up' } });
      expect(namedRedis.ping).toHaveBeenCalledTimes(1);
      expect(mockRedis.ping).not.toHaveBeenCalled();
    });

    it('should report down for explicit connection that fails', async () => {
      const namedRedis = {
        ping: jest.fn().mockRejectedValue(new Error('Cluster unreachable')),
      };

      const result = await indicator.isHealthy('cluster', namedRedis as any);

      expect(result).toEqual({
        cluster: {
          status: 'down',
          message: 'Cluster unreachable',
        },
      });
    });
  });

  describe('without default connection', () => {
    it('should return down when no connection is available', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisHealthIndicator,
          HealthIndicatorService,
          {
            provide: REDIS_HEALTH_INDICATOR,
            useValue: null,
          },
        ],
      }).compile();

      const indicatorWithout =
        module.get<RedisHealthIndicator>(RedisHealthIndicator);

      const result = await indicatorWithout.isHealthy('redis');

      expect(result).toEqual({
        redis: {
          status: 'down',
          message: 'No Redis connection provided',
        },
      });
    });

    it('should still work with explicit connection even without default', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisHealthIndicator,
          HealthIndicatorService,
          {
            provide: REDIS_HEALTH_INDICATOR,
            useValue: null,
          },
        ],
      }).compile();

      const indicatorWithout =
        module.get<RedisHealthIndicator>(RedisHealthIndicator);
      const namedRedis = { ping: jest.fn().mockResolvedValue('PONG') };

      const result = await indicatorWithout.isHealthy(
        'cache',
        namedRedis as any,
      );

      expect(result).toEqual({ cache: { status: 'up' } });
    });
  });
});
