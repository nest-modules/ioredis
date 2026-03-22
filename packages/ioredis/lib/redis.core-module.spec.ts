import Redis from 'ioredis';
import { Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisCoreModule } from './redis.core-module';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from './redis.interfaces';
import { getRedisConnectionToken, getRedisOptionsToken } from './redis.utils';

const REDIS_OPTIONS: RedisModuleOptions = {
  type: 'single',
  options: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
    lazyConnect: true,
  },
};

describe('RedisCoreModule', () => {
  describe('forRoot', () => {
    it('should provide a Redis connection with default token', async () => {
      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const connection = module.get(getRedisConnectionToken());
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should provide a Redis connection with named token', async () => {
      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS, 'cache')],
      }).compile();

      const connection = module.get(getRedisConnectionToken('cache'));
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should provide the Redis options', async () => {
      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const options = module.get(getRedisOptionsToken());
      expect(options).toEqual(REDIS_OPTIONS);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should be global (accessible from child modules without importing)', async () => {
      @Injectable()
      class ChildService {
        constructor() {}
      }

      @Module({
        providers: [ChildService],
        exports: [ChildService],
      })
      class ChildModule {}

      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS), ChildModule],
      }).compile();

      const connection = module.get(getRedisConnectionToken());
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });
  });

  describe('forRootAsync', () => {
    it('should provide a Redis connection with useFactory', async () => {
      const module = await Test.createTestingModule({
        imports: [
          RedisCoreModule.forRootAsync(
            {
              useFactory: () => REDIS_OPTIONS,
            },
            'default',
          ),
        ],
      }).compile();

      const connection = module.get(getRedisConnectionToken('default'));
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should support useFactory with inject via imports', async () => {
      const CONFIG_TOKEN = 'CONFIG';

      @Module({
        providers: [
          {
            provide: CONFIG_TOKEN,
            useValue: { redisOptions: REDIS_OPTIONS },
          },
        ],
        exports: [CONFIG_TOKEN],
      })
      class ConfigModule {}

      const module = await Test.createTestingModule({
        imports: [
          RedisCoreModule.forRootAsync(
            {
              useFactory: (config: { redisOptions: RedisModuleOptions }) =>
                config.redisOptions,
              inject: [CONFIG_TOKEN],
              imports: [ConfigModule],
            },
            'default',
          ),
        ],
      }).compile();

      const connection = module.get(getRedisConnectionToken('default'));
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should support useClass', async () => {
      @Injectable()
      class RedisConfigService implements RedisModuleOptionsFactory {
        createRedisModuleOptions(): RedisModuleOptions {
          return REDIS_OPTIONS;
        }
      }

      const module = await Test.createTestingModule({
        imports: [
          RedisCoreModule.forRootAsync(
            {
              useClass: RedisConfigService,
            },
            'default',
          ),
        ],
      }).compile();

      const connection = module.get(getRedisConnectionToken('default'));
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });

    it('should support useExisting', async () => {
      @Injectable()
      class RedisConfigService implements RedisModuleOptionsFactory {
        createRedisModuleOptions(): RedisModuleOptions {
          return REDIS_OPTIONS;
        }
      }

      @Module({
        providers: [RedisConfigService],
        exports: [RedisConfigService],
      })
      class ConfigModule {}

      const module = await Test.createTestingModule({
        imports: [
          RedisCoreModule.forRootAsync(
            {
              useExisting: RedisConfigService,
              imports: [ConfigModule],
            },
            'default',
          ),
        ],
      }).compile();

      const connection = module.get(getRedisConnectionToken('default'));
      expect(connection).toBeInstanceOf(Redis);

      const app = module.createNestApplication();
      await app.init();
      await app.close();
    });
  });

  describe('createAsyncProviders', () => {
    it('should throw when no useFactory, useClass, or useExisting is provided', () => {
      expect(() => RedisCoreModule.createAsyncProviders({})).toThrow(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    });

    it('should return a single provider for useFactory', () => {
      const providers = RedisCoreModule.createAsyncProviders({
        useFactory: () => REDIS_OPTIONS,
      });
      expect(providers).toHaveLength(1);
    });

    it('should return a single provider for useExisting', () => {
      class ExistingService {}
      const providers = RedisCoreModule.createAsyncProviders({
        useExisting: ExistingService as any,
      });
      expect(providers).toHaveLength(1);
    });

    it('should return two providers for useClass (options + class)', () => {
      class ConfigService {}
      const providers = RedisCoreModule.createAsyncProviders({
        useClass: ConfigService as any,
      });
      expect(providers).toHaveLength(2);
    });
  });

  describe('createAsyncOptionsProvider', () => {
    it('should throw when no strategy is provided', () => {
      expect(() => RedisCoreModule.createAsyncOptionsProvider({})).toThrow(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    });

    it('should create provider with useFactory and inject', () => {
      const factory = () => REDIS_OPTIONS;
      const provider = RedisCoreModule.createAsyncOptionsProvider({
        useFactory: factory,
        inject: ['SomeToken'],
      });

      expect(provider).toEqual({
        provide: getRedisOptionsToken(),
        useFactory: factory,
        inject: ['SomeToken'],
      });
    });

    it('should default inject to empty array when not provided', () => {
      const provider = RedisCoreModule.createAsyncOptionsProvider({
        useFactory: () => REDIS_OPTIONS,
      });

      expect((provider as any).inject).toEqual([]);
    });

    it('should create provider with useExisting', () => {
      class ConfigService {}
      const provider = RedisCoreModule.createAsyncOptionsProvider({
        useExisting: ConfigService as any,
      });

      expect((provider as any).inject).toEqual([ConfigService]);
      expect(typeof (provider as any).useFactory).toBe('function');
    });

    it('should use custom connection name in provider token', () => {
      const provider = RedisCoreModule.createAsyncOptionsProvider(
        { useFactory: () => REDIS_OPTIONS },
        'custom',
      );

      expect((provider as any).provide).toBe(getRedisOptionsToken('custom'));
    });
  });

  describe('onApplicationShutdown', () => {
    it('should gracefully close Redis connections on shutdown', async () => {
      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const connection = module.get<Redis>(getRedisConnectionToken());
      const quitSpy = jest.spyOn(connection, 'quit').mockResolvedValue('OK');

      await app.close();

      expect(quitSpy).toHaveBeenCalled();
    });

    it('should handle errors during shutdown gracefully', async () => {
      const module = await Test.createTestingModule({
        imports: [RedisCoreModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const connection = module.get<Redis>(getRedisConnectionToken());
      jest
        .spyOn(connection, 'quit')
        .mockRejectedValue(new Error('quit failed'));

      // Should not throw even when quit fails
      await expect(app.close()).resolves.not.toThrow();
    });
  });
});
