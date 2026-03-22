import { Inject } from '@nestjs/common';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

export const InjectRedis = (connection?: string) => {
  return Inject(getRedisConnectionToken(connection));
};
