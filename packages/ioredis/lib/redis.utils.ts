import Redis, { RedisOptions } from 'ioredis';
import { RedisModuleOptions } from './redis.interfaces';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN
} from './redis.constants';

export function getRedisOptionsToken(connection?: string): string {
  return `${ connection || REDIS_MODULE_CONNECTION }_${ REDIS_MODULE_OPTIONS_TOKEN }`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${ connection || REDIS_MODULE_CONNECTION }_${ REDIS_MODULE_CONNECTION_TOKEN }`;
}

export function createRedisConnection(options: RedisModuleOptions) {
  const { type, options: commonOptions = {} } = options;

  switch (type) {
    case 'cluster':
      return new Redis.Cluster(options.nodes, commonOptions);
    case 'single':
      const { url, options: { port, host } = {} } = options;
      const connectionOptions: RedisOptions = { ...commonOptions, port, host };

      return url ? new Redis(url, connectionOptions) : new Redis(connectionOptions);
    default:
      throw new Error('Invalid configuration');
  }
}


