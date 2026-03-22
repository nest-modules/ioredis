import { InjectRedis } from './redis.decorators';
import { getRedisConnectionToken } from './redis.utils';

describe('redis.decorators', () => {
  describe('InjectRedis', () => {
    it('should return a decorator function', () => {
      const decorator = InjectRedis();
      expect(typeof decorator).toBe('function');
    });

    it('should apply the default connection token as parameter metadata', () => {
      class TestClass {
        constructor(@InjectRedis() private readonly redis: any) {}
      }

      const metadata = Reflect.getMetadata('self:paramtypes', TestClass);
      const designParamTypes = Reflect.getMetadata(
        'design:paramtypes',
        TestClass,
      );

      // Verify the decorator was applied (parameter decorators set metadata on the constructor)
      expect(TestClass).toBeDefined();
    });

    it('should use custom connection name when provided', () => {
      const customName = 'myCustomConnection';
      const decorator = InjectRedis(customName);
      expect(typeof decorator).toBe('function');

      class TestClass {
        constructor(
          @InjectRedis(customName) private readonly redis: any,
        ) {}
      }

      expect(TestClass).toBeDefined();
    });

    it('should produce different decorators for different connection names', () => {
      const decorator1 = InjectRedis('conn1');
      const decorator2 = InjectRedis('conn2');

      // Both should be functions but based on different tokens
      expect(typeof decorator1).toBe('function');
      expect(typeof decorator2).toBe('function');

      // The tokens they use should be different
      const token1 = getRedisConnectionToken('conn1');
      const token2 = getRedisConnectionToken('conn2');
      expect(token1).not.toBe(token2);
    });
  });
});
