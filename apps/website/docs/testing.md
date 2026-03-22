---
sidebar_position: 5
---

# Testing

## RedisTestModule

The library provides a `RedisTestModule` to simplify unit testing. It creates a mock Redis instance with all standard methods as `jest.fn()` mocks, so you don't need a running Redis server.

```typescript
import { Test } from '@nestjs/testing';
import {
  RedisTestModule,
  MockRedis,
  getRedisConnectionToken,
} from '@nestjs-modules/ioredis';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let redis: MockRedis;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [RedisTestModule.forTest()],
      providers: [MyService],
    }).compile();

    service = module.get(MyService);
    redis = module.get(getRedisConnectionToken());
  });

  it('should get a value', async () => {
    redis.get.mockResolvedValue('hello');

    const result = await service.getValue('key');
    expect(result).toBe('hello');
    expect(redis.get).toHaveBeenCalledWith('key');
  });
});
```

## Named Connections

If your service uses a named connection, pass the name to `forTest()`:

```typescript
const module = await Test.createTestingModule({
  imports: [RedisTestModule.forTest('cache')],
  providers: [CacheService],
}).compile();

const redis = module.get<MockRedis>(getRedisConnectionToken('cache'));
```

## Custom Mock Overrides

You can pre-configure specific methods:

```typescript
RedisTestModule.forTest(undefined, {
  ping: jest.fn().mockResolvedValue('PONG'),
  get: jest.fn().mockResolvedValue('default-value'),
});
```

## createMockRedis

For manual test setups without the module, use `createMockRedis()`:

```typescript
import { createMockRedis } from '@nestjs-modules/ioredis';

const mockRedis = createMockRedis();
mockRedis.get.mockResolvedValue('value');
```

## Manual Mocking (without RedisTestModule)

You can also mock Redis manually using `getRedisConnectionToken()`:

```typescript
import { Test } from '@nestjs/testing';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';

const module = await Test.createTestingModule({
  providers: [
    MyService,
    {
      provide: getRedisConnectionToken(),
      useValue: {
        get: jest.fn().mockResolvedValue('value'),
        set: jest.fn().mockResolvedValue('OK'),
      },
    },
  ],
}).compile();
```
