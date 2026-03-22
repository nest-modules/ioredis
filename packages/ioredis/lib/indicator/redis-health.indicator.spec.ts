import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckError } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health.indicator';
import { REDIS_HEALTH_INDICATOR } from '../redis.constants';

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

    it('should throw HealthCheckError when ping fails', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection refused'));

      await expect(indicator.isHealthy('redis')).rejects.toThrow(
        HealthCheckError,
      );
      await expect(indicator.isHealthy('redis')).rejects.toThrow(
        'Redis check failed',
      );
    });

    it('should include error message in health check error details', async () => {
      mockRedis.ping.mockRejectedValue(new Error('ECONNREFUSED'));

      try {
        await indicator.isHealthy('redis');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HealthCheckError);
        const healthError = error as HealthCheckError;
        expect(healthError.causes).toEqual({
          redis: {
            status: 'down',
            message: 'ECONNREFUSED',
          },
        });
      }
    });

    it('should handle non-Error thrown values gracefully', async () => {
      mockRedis.ping.mockRejectedValue('string error');

      try {
        await indicator.isHealthy('redis');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HealthCheckError);
        const healthError = error as HealthCheckError;
        expect(healthError.causes).toEqual({
          redis: {
            status: 'down',
            message: 'Unknown error',
          },
        });
      }
    });

    it('should use custom key name in result', async () => {
      mockRedis.ping.mockResolvedValue('PONG');

      const result = await indicator.isHealthy('my-redis-cache');

      expect(result).toEqual({ 'my-redis-cache': { status: 'up' } });
    });
  });
});
