import Redis from 'ioredis';
import { REDIS_HEALTH_INDICATOR } from '../constants';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

export const redisHealthIndicatorProvider = {
  provide: REDIS_HEALTH_INDICATOR,
  useFactory: (redis: Redis) => redis,
  inject: [getRedisConnectionToken()],
};
