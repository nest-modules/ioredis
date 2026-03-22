import Redis from 'ioredis';
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from '../constants';
import {
  createRedisConnection,
  getRedisConnectionToken,
  getRedisOptionsToken,
} from '../utils/redis-connection.util';

describe('redis-connection.util', () => {
  describe('getRedisOptionsToken', () => {
    it('should return default token when no connection name is provided', () => {
      const token = getRedisOptionsToken();
      expect(token).toBe(
        `${REDIS_MODULE_CONNECTION}_${REDIS_MODULE_OPTIONS_TOKEN}`,
      );
    });

    it('should return custom token when connection name is provided', () => {
      const token = getRedisOptionsToken('myConnection');
      expect(token).toBe(`myConnection_${REDIS_MODULE_OPTIONS_TOKEN}`);
    });

    it('should return different tokens for different connection names', () => {
      const token1 = getRedisOptionsToken('conn1');
      const token2 = getRedisOptionsToken('conn2');
      expect(token1).not.toBe(token2);
    });
  });

  describe('getRedisConnectionToken', () => {
    it('should return default token when no connection name is provided', () => {
      const token = getRedisConnectionToken();
      expect(token).toBe(
        `${REDIS_MODULE_CONNECTION}_${REDIS_MODULE_CONNECTION_TOKEN}`,
      );
    });

    it('should return custom token when connection name is provided', () => {
      const token = getRedisConnectionToken('myConnection');
      expect(token).toBe(`myConnection_${REDIS_MODULE_CONNECTION_TOKEN}`);
    });

    it('should return different tokens for different connection names', () => {
      const token1 = getRedisConnectionToken('conn1');
      const token2 = getRedisConnectionToken('conn2');
      expect(token1).not.toBe(token2);
    });
  });

  describe('createRedisConnection', () => {
    it('should create a single Redis instance with host and port', () => {
      const connection = createRedisConnection({
        type: 'single',
        options: { host: '127.0.0.1', port: 6379, lazyConnect: true },
      });
      expect(connection).toBeInstanceOf(Redis);
      connection.disconnect();
    });

    it('should create a single Redis instance with url', () => {
      const connection = createRedisConnection({
        type: 'single',
        url: 'redis://127.0.0.1:6379',
        options: { lazyConnect: true },
      });
      expect(connection).toBeInstanceOf(Redis);
      connection.disconnect();
    });

    it('should create a single Redis instance without explicit host/port', () => {
      const connection = createRedisConnection({
        type: 'single',
        options: { lazyConnect: true },
      });
      expect(connection).toBeInstanceOf(Redis);
      connection.disconnect();
    });

    it('should create a Redis.Cluster instance for cluster type', () => {
      const connection = createRedisConnection({
        type: 'cluster',
        nodes: [{ host: '127.0.0.1', port: 6379 }],
        options: { lazyConnect: true },
      });
      expect(connection).toBeInstanceOf(Redis.Cluster);
      connection.disconnect();
    });

    it('should throw for invalid type', () => {
      expect(() => createRedisConnection({ type: 'invalid' } as any)).toThrow(
        'Invalid configuration',
      );
    });

    it('should merge common options with host/port for single type', () => {
      const connection = createRedisConnection({
        type: 'single',
        options: {
          host: '127.0.0.1',
          port: 6380,
          password: 'testpass',
          db: 1,
          lazyConnect: true,
        },
      });
      expect(connection).toBeInstanceOf(Redis);
      expect((connection as Redis).options.db).toBe(1);
      connection.disconnect();
    });
  });
});
