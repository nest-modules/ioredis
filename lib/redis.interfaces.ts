import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import * as Redis from 'ioredis';

export type Redis = Redis.Redis;

export interface RedisModuleOptions {
  config: Redis.RedisOptions & { url?: string };
}

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<RedisModuleOptionsFactory>;
  useExisting?: Type<RedisModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
