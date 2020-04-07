import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from './redis.utils';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};
