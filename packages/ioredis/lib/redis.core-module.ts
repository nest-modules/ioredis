import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from './redis.interfaces';
import {
  createRedisConnection,
  getRedisConnectionToken,
  getRedisOptionsToken,
} from './redis.utils';

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
  private static readonly connectionTokens: string[] = [];

  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    for (const token of RedisCoreModule.connectionTokens) {
      try {
        const connection = this.moduleRef.get<Redis>(token);
        if (connection && typeof connection.quit === 'function') {
          await connection.quit();
        }
      } catch {}
    }
    RedisCoreModule.connectionTokens.length = 0;
  }

  /* forRoot */
  static forRoot(
    options: RedisModuleOptions,
    connection?: string,
  ): DynamicModule {
    const connectionToken = getRedisConnectionToken(connection);
    RedisCoreModule.connectionTokens.push(connectionToken);

    const redisOptionsProvider: Provider = {
      provide: getRedisOptionsToken(connection),
      useValue: options,
    };

    const redisConnectionProvider: Provider = {
      provide: connectionToken,
      useValue: createRedisConnection(options),
    };

    return {
      module: RedisCoreModule,
      providers: [redisOptionsProvider, redisConnectionProvider],
      exports: [redisOptionsProvider, redisConnectionProvider],
    };
  }

  /* forRootAsync */
  public static forRootAsync(
    options: RedisModuleAsyncOptions,
    connection: string,
  ): DynamicModule {
    const connectionToken = getRedisConnectionToken(connection);
    RedisCoreModule.connectionTokens.push(connectionToken);

    const redisConnectionProvider: Provider = {
      provide: connectionToken,
      useFactory(options: RedisModuleOptions) {
        return createRedisConnection(options);
      },
      inject: [getRedisOptionsToken(connection)],
    };

    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [
        ...RedisCoreModule.createAsyncProviders(options, connection),
        redisConnectionProvider,
      ],
      exports: [redisConnectionProvider],
    };
  }

  /* createAsyncProviders */
  public static createAsyncProviders(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): Provider[] {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    if (options.useExisting || options.useFactory) {
      return [RedisCoreModule.createAsyncOptionsProvider(options, connection)];
    }

    return [
      RedisCoreModule.createAsyncOptionsProvider(options, connection),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  /* createAsyncOptionsProvider */
  public static createAsyncOptionsProvider(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): Provider {
    if (!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    if (options.useFactory) {
      return {
        provide: getRedisOptionsToken(connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getRedisOptionsToken(connection),
      async useFactory(
        optionsFactory: RedisModuleOptionsFactory,
      ): Promise<RedisModuleOptions> {
        return await optionsFactory.createRedisModuleOptions();
      },
      inject: [options.useClass || options.useExisting],
    };
  }
}
