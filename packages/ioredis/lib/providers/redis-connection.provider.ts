import { Provider } from '@nestjs/common';
import { RedisModuleOptions } from '../interfaces';
import {
  createRedisConnection,
  getRedisConnectionToken,
  getRedisOptionsToken,
} from '../utils/redis-connection.util';

export function createRedisConnectionProvider(
  options: RedisModuleOptions,
  connection?: string,
): Provider {
  return {
    provide: getRedisConnectionToken(connection),
    useValue: createRedisConnection(options),
  };
}

export function createRedisAsyncConnectionProvider(
  connection?: string,
): Provider {
  return {
    provide: getRedisConnectionToken(connection),
    useFactory: (options: RedisModuleOptions) => createRedisConnection(options),
    inject: [getRedisOptionsToken(connection)],
  };
}
