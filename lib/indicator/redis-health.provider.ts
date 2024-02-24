import Redis, { RedisOptions } from 'ioredis';
import { REDIS_HEALTH_INDICATOR, REDIS_CONFIG_OPTIONS } from '../redis.constants';

export const redisHealthIndicatorProvider = {
  provide: REDIS_HEALTH_INDICATOR,
  useFactory: (
    redisConfigOrConnection: RedisOptions | Redis
  ) => redisConfigOrConnection instanceof Redis
        ? redisConfigOrConnection
        : new Redis(redisConfigOrConnection),
  inject: [REDIS_CONFIG_OPTIONS],
};
