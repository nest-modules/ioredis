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

### onClientReady Callback

You can pass an `onClientReady` callback to access the Redis client immediately after creation. This is useful for attaching event listeners or running initialization logic:

```typescript
RedisModule.forRoot({
  type: 'single',
  url: 'redis://localhost:6379',
  onClientReady: (client) => {
    client.on('error', (err) => console.error('Redis error:', err));
    client.on('connect', () => console.log('Redis connected'));
  },
});
```

This also works with cluster connections:

```typescript
RedisModule.forRoot({
  type: 'cluster',
  nodes: [{ host: '127.0.0.1', port: 7000 }],
  onClientReady: (cluster) => {
    cluster.on('error', (err) => console.error('Cluster error:', err));
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
