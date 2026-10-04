---
sidebar_position: 1
---

# Getting Started

## Installation

```bash
pnpm add @nestjs-modules/ioredis ioredis
```

### Compatibility

| `@nestjs/*` | `@nestjs/terminus` | Node.js |
|-------------|--------------------|---------|
| 11.x | 11.x | 20+ |
| 11.x | 12.x | 20.19+, 22.12+ or 24+ |
| 12.x | 12.x | 20.19+, 22.12+ or 24+ |

NestJS 12 ships as ES modules only. The library is published as CommonJS
and loads NestJS through `require(esm)`, which is enabled by default from
the Node.js versions listed above. If you run unit tests with Jest, start it
with `--experimental-vm-modules` so Jest can `require` the NestJS 12 packages
as well.

## Basic Usage

Import `RedisModule` into the root `AppModule` and use the `forRoot()` method to configure it:

```typescript
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
})
export class AppModule {}
```

## Injecting Redis

Use the `@InjectRedis()` decorator to inject the Redis client into your services:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CatsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }
}
```
