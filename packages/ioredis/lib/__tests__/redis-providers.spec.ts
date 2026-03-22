import { RedisModuleOptions } from '../interfaces';
import {
  createRedisAsyncConnectionProvider,
  createRedisConnectionProvider,
} from '../providers/redis-connection.provider';
import {
  createAsyncOptionsProvider,
  createAsyncProviders,
  createRedisOptionsProvider,
} from '../providers/redis-options.provider';
import {
  getRedisConnectionToken,
  getRedisOptionsToken,
} from '../utils/redis-connection.util';

const REDIS_OPTIONS: RedisModuleOptions = {
  type: 'single',
  options: {
    host: '127.0.0.1',
    port: 6379,
    lazyConnect: true,
  },
};

describe('redis-options.provider', () => {
  describe('createRedisOptionsProvider', () => {
    it('should create a provider with default connection token', () => {
      const provider = createRedisOptionsProvider(REDIS_OPTIONS);
      expect(provider).toEqual({
        provide: getRedisOptionsToken(),
        useValue: REDIS_OPTIONS,
      });
    });

    it('should create a provider with named connection token', () => {
      const provider = createRedisOptionsProvider(REDIS_OPTIONS, 'cache');
      expect(provider).toEqual({
        provide: getRedisOptionsToken('cache'),
        useValue: REDIS_OPTIONS,
      });
    });
  });

  describe('createAsyncProviders', () => {
    it('should throw when no strategy is provided', () => {
      expect(() => createAsyncProviders({})).toThrow(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    });

    it('should return one provider for useFactory', () => {
      const providers = createAsyncProviders({
        useFactory: () => REDIS_OPTIONS,
      });
      expect(providers).toHaveLength(1);
    });

    it('should return one provider for useExisting', () => {
      class Svc {}
      const providers = createAsyncProviders({
        useExisting: Svc as any,
      });
      expect(providers).toHaveLength(1);
    });

    it('should return two providers for useClass', () => {
      class Svc {}
      const providers = createAsyncProviders({
        useClass: Svc as any,
      });
      expect(providers).toHaveLength(2);
    });
  });

  describe('createAsyncOptionsProvider', () => {
    it('should throw when no strategy is provided', () => {
      expect(() => createAsyncOptionsProvider({})).toThrow(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    });

    it('should create provider with useFactory', () => {
      const factory = () => REDIS_OPTIONS;
      const provider = createAsyncOptionsProvider({
        useFactory: factory,
        inject: ['Token'],
      });
      expect(provider).toEqual({
        provide: getRedisOptionsToken(),
        useFactory: factory,
        inject: ['Token'],
      });
    });

    it('should default inject to empty array', () => {
      const provider = createAsyncOptionsProvider({
        useFactory: () => REDIS_OPTIONS,
      });
      expect((provider as any).inject).toEqual([]);
    });

    it('should create provider with useExisting', () => {
      class Svc {}
      const provider = createAsyncOptionsProvider({
        useExisting: Svc as any,
      });
      expect((provider as any).inject).toEqual([Svc]);
      expect(typeof (provider as any).useFactory).toBe('function');
    });

    it('should use custom connection name', () => {
      const provider = createAsyncOptionsProvider(
        { useFactory: () => REDIS_OPTIONS },
        'custom',
      );
      expect((provider as any).provide).toBe(getRedisOptionsToken('custom'));
    });
  });
});

describe('redis-connection.provider', () => {
  describe('createRedisConnectionProvider', () => {
    it('should create a provider with the correct token', () => {
      const provider = createRedisConnectionProvider(REDIS_OPTIONS);
      expect((provider as any).provide).toBe(getRedisConnectionToken());
    });

    it('should create a provider with named token', () => {
      const provider = createRedisConnectionProvider(REDIS_OPTIONS, 'cache');
      expect((provider as any).provide).toBe(getRedisConnectionToken('cache'));
    });
  });

  describe('createRedisAsyncConnectionProvider', () => {
    it('should create an async provider with the correct token', () => {
      const provider = createRedisAsyncConnectionProvider();
      expect((provider as any).provide).toBe(getRedisConnectionToken());
      expect(typeof (provider as any).useFactory).toBe('function');
      expect((provider as any).inject).toEqual([getRedisOptionsToken()]);
    });

    it('should create an async provider with named token', () => {
      const provider = createRedisAsyncConnectionProvider('session');
      expect((provider as any).provide).toBe(
        getRedisConnectionToken('session'),
      );
      expect((provider as any).inject).toEqual([
        getRedisOptionsToken('session'),
      ]);
    });
  });
});
