import {
  DynamicModule,
  Global,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Redis from 'ioredis';
import { RedisModuleAsyncOptions, RedisModuleOptions } from '../interfaces';
import {
  createRedisAsyncConnectionProvider,
  createRedisConnectionProvider,
} from '../providers/redis-connection.provider';
import {
  createAsyncOptionsProvider,
  createAsyncProviders,
  createRedisOptionsProvider,
} from '../providers/redis-options.provider';
import { getRedisConnectionToken } from '../utils/redis-connection.util';

@Global()
@Module({})
export class RedisCoreModule implements OnApplicationShutdown {
  private static readonly connectionTokens = new Set<string>();

  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    // Each registered connection gets its own RedisCoreModule instance, and the
    // strict `moduleRef.get` only resolves that instance's own connection. The
    // shared set must not be cleared here, or instances that shut down later
    // would skip their connections and leave them open.
    for (const token of RedisCoreModule.connectionTokens) {
      try {
        const connection = this.moduleRef.get<Redis>(token);
        if (connection && typeof connection.quit === 'function') {
          await connection.quit();
        }
      } catch {}
    }
  }

  static forRoot(
    options: RedisModuleOptions,
    connection?: string,
  ): DynamicModule {
    const connectionToken = getRedisConnectionToken(connection);
    RedisCoreModule.connectionTokens.add(connectionToken);

    const optionsProvider = createRedisOptionsProvider(options, connection);
    const connectionProvider = createRedisConnectionProvider(
      options,
      connection,
    );

    return {
      module: RedisCoreModule,
      providers: [optionsProvider, connectionProvider],
      exports: [optionsProvider, connectionProvider],
    };
  }

  static forRootAsync(
    options: RedisModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    const connectionToken = getRedisConnectionToken(connection);
    RedisCoreModule.connectionTokens.add(connectionToken);

    const asyncConnectionProvider =
      createRedisAsyncConnectionProvider(connection);

    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [
        ...createAsyncProviders(options, connection),
        asyncConnectionProvider,
      ],
      exports: [asyncConnectionProvider],
    };
  }

  static createAsyncProviders = createAsyncProviders;
  static createAsyncOptionsProvider = createAsyncOptionsProvider;
}
