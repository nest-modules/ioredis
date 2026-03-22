---
sidebar_position: 4
---

# Health Check

## Setup

The module provides a health indicator for use with `@nestjs/terminus`.

First, install the optional dependency:

```bash
pnpm add @nestjs/terminus
```

Then import the `RedisHealthModule`:

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    TerminusModule,
    RedisHealthModule,
  ],
})
export class HealthModule {}
```

## Usage

Inject `RedisHealthIndicator` to check Redis connectivity:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RedisHealthIndicator } from '@nestjs-modules/ioredis';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.redisHealth.isHealthy('redis'),
    ]);
  }
}
```

## Named Connections

If you use multiple Redis connections, you can check any of them by passing the connection instance directly:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { InjectRedis, RedisHealthIndicator } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redisHealth: RedisHealthIndicator,
    @InjectRedis('cache') private readonly cacheRedis: Redis,
    @InjectRedis('session') private readonly sessionRedis: Redis,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.redisHealth.isHealthy('cache', this.cacheRedis),
      () => this.redisHealth.isHealthy('session', this.sessionRedis),
    ]);
  }
}
```
