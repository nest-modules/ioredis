import { Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { InjectRedis } from '../decorators/inject-redis.decorator';
import { RedisModuleOptions, RedisModuleOptionsFactory } from '../interfaces';
import { RedisModule } from '../modules/redis.module';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

const REDIS_OPTIONS: RedisModuleOptions = {
  type: 'single',
  options: {
    host: '127.0.0.1',
    port: 6379,
    password: '123456',
    lazyConnect: true,
  },
};

describe('RedisModule', () => {
  describe('forRoot', () => {
    it('should create the RedisModule', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisModule = module.get(RedisModule);
      expect(redisModule).toBeInstanceOf(RedisModule);

      await app.close();
    });

    it('should provide a Redis client with default connection', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should provide the same Redis instance for the same token', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const client1 = module.get(getRedisConnectionToken());
      const client2 = module.get(getRedisConnectionToken());
      expect(client1).toBe(client2);

      await app.close();
    });

    it('should support named connections', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS, 'cache')],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken('cache'));
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should support multiple named connections', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRoot(REDIS_OPTIONS, 'cache'),
          RedisModule.forRoot(REDIS_OPTIONS, 'session'),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const cacheClient = module.get(getRedisConnectionToken('cache'));
      const sessionClient = module.get(getRedisConnectionToken('session'));

      expect(cacheClient).toBeInstanceOf(Redis);
      expect(sessionClient).toBeInstanceOf(Redis);
      expect(cacheClient).not.toBe(sessionClient);

      await app.close();
    });
  });

  describe('forRootAsync', () => {
    it('should provide a Redis client using useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRootAsync({
            useFactory: () => REDIS_OPTIONS,
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should support async useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRootAsync({
            useFactory: async () => {
              return REDIS_OPTIONS;
            },
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should support useFactory with inject via imports', async () => {
      const CONFIG = 'APP_CONFIG';

      @Module({
        providers: [
          {
            provide: CONFIG,
            useValue: { redis: REDIS_OPTIONS },
          },
        ],
        exports: [CONFIG],
      })
      class ConfigModule {}

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRootAsync({
            useFactory: (config: { redis: RedisModuleOptions }) => config.redis,
            inject: [CONFIG],
            imports: [ConfigModule],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should support useClass', async () => {
      @Injectable()
      class RedisConfigService implements RedisModuleOptionsFactory {
        createRedisModuleOptions(): RedisModuleOptions {
          return REDIS_OPTIONS;
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRootAsync({
            useClass: RedisConfigService,
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

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

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRootAsync({
            useExisting: RedisConfigService,
            imports: [ConfigModule],
          }),
        ],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const redisClient = module.get(getRedisConnectionToken());
      expect(redisClient).toBeInstanceOf(Redis);

      await app.close();
    });
  });

  describe('@InjectRedis decorator', () => {
    it('should inject the default Redis connection', async () => {
      @Injectable()
      class TestService {
        constructor(@InjectRedis() private readonly redis: Redis) {}
        getClient() {
          return this.redis;
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS)],
        providers: [TestService],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const service = module.get(TestService);
      expect(service.getClient()).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should inject a named Redis connection', async () => {
      @Injectable()
      class CacheService {
        constructor(@InjectRedis('cache') private readonly redis: Redis) {}
        getClient() {
          return this.redis;
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS, 'cache')],
        providers: [CacheService],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const service = module.get(CacheService);
      expect(service.getClient()).toBeInstanceOf(Redis);

      await app.close();
    });

    it('should inject different clients for different named connections', async () => {
      @Injectable()
      class MultiRedisService {
        constructor(
          @InjectRedis('cache') private readonly cache: Redis,
          @InjectRedis('session') private readonly session: Redis,
        ) {}
        getCacheClient() {
          return this.cache;
        }
        getSessionClient() {
          return this.session;
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisModule.forRoot(REDIS_OPTIONS, 'cache'),
          RedisModule.forRoot(REDIS_OPTIONS, 'session'),
        ],
        providers: [MultiRedisService],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const service = module.get(MultiRedisService);
      const cacheClient = service.getCacheClient();
      const sessionClient = service.getSessionClient();

      expect(cacheClient).toBeInstanceOf(Redis);
      expect(sessionClient).toBeInstanceOf(Redis);
      expect(cacheClient).not.toBe(sessionClient);

      await app.close();
    });
  });

  describe('graceful shutdown', () => {
    it('should close Redis connections on app shutdown', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule.forRoot(REDIS_OPTIONS)],
      }).compile();

      const app = module.createNestApplication();
      await app.init();

      const connection = module.get<Redis>(getRedisConnectionToken());
      const quitSpy = jest.spyOn(connection, 'quit').mockResolvedValue('OK');

      await app.close();

      expect(quitSpy).toHaveBeenCalled();
    });
  });
});
