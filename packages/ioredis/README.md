<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">@nestjs-modules/ioredis</h1>

<p align="center">
  A <a href="https://github.com/luin/ioredis">ioredis</a> module for the <a href="https://nestjs.com/">NestJS</a> framework.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs-modules/ioredis"><img src="https://img.shields.io/npm/v/@nestjs-modules/ioredis.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@nestjs-modules/ioredis"><img src="https://img.shields.io/npm/l/@nestjs-modules/ioredis.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/@nestjs-modules/ioredis"><img src="https://img.shields.io/npm/dm/@nestjs-modules/ioredis.svg" alt="NPM Downloads" /></a>
</p>

## Installation

```sh
pnpm add @nestjs-modules/ioredis ioredis
```

## Quick Start

```ts
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

```ts
import { Controller, Get } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Get()
  async ping() {
    await this.redis.set('key', 'value');
    return this.redis.get('key');
  }
}
```

## Documentation

Full documentation is available at **[nest-modules.github.io/ioredis](https://nest-modules.github.io/ioredis/)**.

- [Getting Started](https://nest-modules.github.io/ioredis/docs/getting-started)
- [Configuration](https://nest-modules.github.io/ioredis/docs/configuration)
- [Cluster](https://nest-modules.github.io/ioredis/docs/cluster)
- [Health Checks](https://nest-modules.github.io/ioredis/docs/health-check)
- [Testing](https://nest-modules.github.io/ioredis/docs/testing)

## License

MIT
