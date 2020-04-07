<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A ioredis module for Nest framework (node.js) using <a href="https://github.com/luin/ioredis">ioredis</a> library
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/nestjs-modules"><img src="https://img.shields.io/npm/v/@nestjs-modules/ioredis.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/org/nestjs-modules"><img src="https://img.shields.io/npm/l/@nestjs-modules/ioredis.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/org/nestjs-modules"><img src="https://img.shields.io/npm/dm/@nestjs-modules/ioredis.svg" alt="NPM Downloads" /></a>
</p>

### Installation

#### with npm
```sh
npm install --save @nestjs-modules/ioredis ioredis
```

#### with yarn
```sh
yarn add @nestjs-modules/ioredis ioredis
```

### How to use?

#### RedisModule.forRoot(options, connection?)

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule.forRoot({
      config: { 
        url: 'redis://localhost:6379',
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

#### RedisModule.forRootAsync(options, connection?)

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: { 
          url: 'redis://localhost:6379',
        },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

#### InjectRedis(connection?)

```ts
import { Controller, Get, } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Controller()
export class AppController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get()
  async getHello() {
    await this.redis.set('key', 'Redis data!');
    const redisData = await this.redis.get("key");
    return { redisData };
  }
}
```

## License

MIT
