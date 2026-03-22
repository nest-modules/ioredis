import { Provider } from '@nestjs/common';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '../interfaces';
import { getRedisOptionsToken } from '../utils/redis-connection.util';

export function createRedisOptionsProvider(
  options: RedisModuleOptions,
  connection?: string,
): Provider {
  return {
    provide: getRedisOptionsToken(connection),
    useValue: options,
  };
}

export function createAsyncProviders(
  options: RedisModuleAsyncOptions,
  connection?: string,
): Provider[] {
  if (!(options.useExisting || options.useFactory || options.useClass)) {
    throw new Error(
      'Invalid configuration. Must provide useFactory, useClass or useExisting',
    );
  }

  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options, connection)];
  }

  return [
    createAsyncOptionsProvider(options, connection),
    { provide: options.useClass, useClass: options.useClass },
  ];
}

export function createAsyncOptionsProvider(
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
