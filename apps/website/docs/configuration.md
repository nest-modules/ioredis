---
sidebar_position: 2
---

# Configuration

## forRoot

The `forRoot()` method accepts a configuration object for a single Redis instance or a Redis cluster.

### Single Instance

```typescript
RedisModule.forRoot({
  type: 'single',
  url: 'redis://localhost:6379',
});
```

### With Options

```typescript
RedisModule.forRoot({
  type: 'single',
  options: {
    host: 'localhost',
    port: 6379,
    password: 'your-password',
    db: 0,
  },
});
```

## forRootAsync

Use `forRootAsync()` for dynamic configuration, for example with `@nestjs/config`:

```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```
