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
    for (const token of RedisCoreModule.connectionTokens) {
      try {
        const connection = this.moduleRef.get<Redis>(token);
        if (connection && typeof connection.quit === 'function') {
          await connection.quit();
        }
      } catch {}
    }
    RedisCoreModule.connectionTokens.clear();
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
