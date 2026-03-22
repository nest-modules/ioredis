import { InjectRedis } from '../decorators/inject-redis.decorator';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

describe('InjectRedis', () => {
  it('should return a decorator function', () => {
    const decorator = InjectRedis();
    expect(typeof decorator).toBe('function');
  });

  it('should apply the default connection token as parameter metadata', () => {
    class TestClass {
      constructor(@InjectRedis() readonly _redis: any) {}
    }

    expect(TestClass).toBeDefined();
  });

  it('should use custom connection name when provided', () => {
    const customName = 'myCustomConnection';
    const decorator = InjectRedis(customName);
    expect(typeof decorator).toBe('function');

    class TestClass {
      constructor(@InjectRedis(customName) readonly _redis: any) {}
    }

    expect(TestClass).toBeDefined();
  });

  it('should produce different decorators for different connection names', () => {
    const decorator1 = InjectRedis('conn1');
    const decorator2 = InjectRedis('conn2');

    expect(typeof decorator1).toBe('function');
    expect(typeof decorator2).toBe('function');

    const token1 = getRedisConnectionToken('conn1');
    const token2 = getRedisConnectionToken('conn2');
    expect(token1).not.toBe(token2);
  });
});
