import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import Redis, { Cluster } from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../constants';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Optional()
    @Inject(REDIS_HEALTH_INDICATOR)
    private readonly redis: Redis | Cluster | null,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(
    key: string,
    connection?: Redis | Cluster,
  ): Promise<HealthIndicatorResult> {
    const redis = connection ?? this.redis;

    if (!redis) {
      return this.healthIndicatorService.check(key).down({
        message: 'No Redis connection provided',
      });
    }

    try {
      await redis.ping();
      return this.healthIndicatorService.check(key).up();
    } catch (error) {
      return this.healthIndicatorService.check(key).down({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
