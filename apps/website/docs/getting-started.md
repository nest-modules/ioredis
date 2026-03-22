---
sidebar_position: 1
---

# Getting Started

## Installation

```bash
pnpm add @nestjs-modules/ioredis ioredis
```

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
