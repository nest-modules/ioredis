import Redis from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../redis.constants';

export const redisHealthIndicatorProvider = {
  provide: REDIS_HEALTH_INDICATOR,
  useFactory: () => new Redis(),
};
