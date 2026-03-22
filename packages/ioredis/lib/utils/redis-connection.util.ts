import Redis, { Cluster } from 'ioredis';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from '../constants';
import { RedisModuleOptions } from '../interfaces';

export function getRedisOptionsToken(connection?: string): string {
  return `${connection || REDIS_MODULE_CONNECTION}_${REDIS_MODULE_OPTIONS_TOKEN}`;
}

export function getRedisConnectionToken(connection?: string): string {
  return `${connection || REDIS_MODULE_CONNECTION}_${REDIS_MODULE_CONNECTION_TOKEN}`;
}

export function createRedisConnection(
  options: RedisModuleOptions,
): Redis | Cluster {
  const { type } = options;

  switch (type) {
    case 'cluster': {
      const { nodes, options: clusterOptions = {} } = options;
      return new Redis.Cluster(nodes, clusterOptions);
    }
    case 'single': {
      const { url, options: redisOptions = {} } = options;
      return url ? new Redis(url, redisOptions) : new Redis(redisOptions);
    }
    default:
      throw new Error(
        `Invalid configuration: unknown type "${(options as any).type}"`,
      );
  }
}
