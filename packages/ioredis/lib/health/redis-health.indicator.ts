import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../constants';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(REDIS_HEALTH_INDICATOR) private readonly redis: Redis,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();
      return this.healthIndicatorService.check(key).up();
    } catch (error) {
      return this.healthIndicatorService.check(key).down({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
