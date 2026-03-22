import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InjectRedis } from '../decorators/inject-redis.decorator';
import {
  createMockRedis,
  MockRedis,
  RedisTestModule,
} from '../testing/redis-test.module';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

describe('RedisTestModule', () => {
  describe('forTest', () => {
    it('should provide a mock Redis connection with default token', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisTestModule.forTest()],
      }).compile();

      const redis = module.get<MockRedis>(getRedisConnectionToken());
      expect(redis).toBeDefined();
      expect(typeof redis.get).toBe('function');
      expect(typeof redis.set).toBe('function');
      expect(typeof redis.del).toBe('function');
    });

    it('should provide a mock Redis connection with named token', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisTestModule.forTest('cache')],
      }).compile();

      const redis = module.get<MockRedis>(getRedisConnectionToken('cache'));
      expect(redis).toBeDefined();
      expect(typeof redis.get).toBe('function');
    });

    it('should work with @InjectRedis decorator', async () => {
      @Injectable()
      class TestService {
        constructor(@InjectRedis() private readonly redis: MockRedis) {}

        async getValue(key: string) {
          return this.redis.get(key);
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisTestModule.forTest()],
        providers: [TestService],
      }).compile();

      const service = module.get<TestService>(TestService);
      const redis = module.get<MockRedis>(getRedisConnectionToken());

      redis.get.mockResolvedValue('test-value');

      const result = await service.getValue('key');
      expect(result).toBe('test-value');
      expect(redis.get).toHaveBeenCalledWith('key');
    });

    it('should work with named @InjectRedis decorator', async () => {
      @Injectable()
      class TestService {
        constructor(
          @InjectRedis('session') private readonly redis: MockRedis,
        ) {}

        async getSession(id: string) {
          return this.redis.get(id);
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisTestModule.forTest('session')],
        providers: [TestService],
      }).compile();

      const service = module.get<TestService>(TestService);
      const redis = module.get<MockRedis>(getRedisConnectionToken('session'));

      redis.get.mockResolvedValue('session-data');

      const result = await service.getSession('sess:123');
      expect(result).toBe('session-data');
      expect(redis.get).toHaveBeenCalledWith('sess:123');
    });

    it('should accept overrides for specific methods', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          RedisTestModule.forTest(undefined, {
            ping: jest.fn().mockResolvedValue('PONG'),
          }),
        ],
      }).compile();

      const redis = module.get<MockRedis>(getRedisConnectionToken());
      const result = await redis.ping();
      expect(result).toBe('PONG');
    });

    it('should be global (accessible from child modules)', async () => {
      @Injectable()
      class ChildService {
        constructor(@InjectRedis() private readonly redis: MockRedis) {}
        async ping() {
          return this.redis.ping();
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [RedisTestModule.forTest()],
        providers: [ChildService],
      }).compile();

      const service = module.get<ChildService>(ChildService);
      expect(service).toBeDefined();
    });
  });

  describe('createMockRedis', () => {
    it('should create a mock with all standard Redis methods', () => {
      const mock = createMockRedis();

      expect(typeof mock.get).toBe('function');
      expect(typeof mock.set).toBe('function');
      expect(typeof mock.del).toBe('function');
      expect(typeof mock.hget).toBe('function');
      expect(typeof mock.hset).toBe('function');
      expect(typeof mock.lpush).toBe('function');
      expect(typeof mock.rpush).toBe('function');
      expect(typeof mock.sadd).toBe('function');
      expect(typeof mock.zadd).toBe('function');
      expect(typeof mock.publish).toBe('function');
      expect(typeof mock.ping).toBe('function');
      expect(typeof mock.quit).toBe('function');
      expect(typeof mock.pipeline).toBe('function');
      expect(typeof mock.multi).toBe('function');
      expect(typeof mock.scan).toBe('function');
    });

    it('should create jest mock functions that can be configured', () => {
      const mock = createMockRedis();

      mock.get.mockResolvedValue('value');
      mock.set.mockResolvedValue('OK');

      expect(mock.get).not.toHaveBeenCalled();
      mock.get('key');
      expect(mock.get).toHaveBeenCalledWith('key');
    });

    it('should allow overrides', () => {
      const customPing = jest.fn().mockResolvedValue('CUSTOM');
      const mock = createMockRedis({ ping: customPing });

      expect(mock.ping).toBe(customPing);
      expect(typeof mock.get).toBe('function');
    });
  });
});
