import Redis from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../redis.constants';
import { getRedisConnectionToken } from '../redis.utils';

export const redisHealthIndicatorProvider = {
  provide: REDIS_HEALTH_INDICATOR,
  useFactory: (redis: Redis) => redis,
  inject: [getRedisConnectionToken()],
};
