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
      const { nodes, options: clusterOptions = {}, onClientReady } = options;
      const client = new Redis.Cluster(nodes, clusterOptions);
      if (onClientReady) {
        onClientReady(client);
      }
      return client;
    }
    case 'single': {
      const { url, options: redisOptions = {}, onClientReady } = options;
      const client = url
        ? new Redis(url, redisOptions)
        : new Redis(redisOptions);
      if (onClientReady) {
        onClientReady(client);
      }
      return client;
    }
    default:
      throw new Error(
        `Invalid configuration: unknown type "${(options as any).type}"`,
      );
  }
}
