import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { RedisOptions, ClusterOptions, ClusterNode } from 'ioredis';

export interface RedisSingleOptions {
  type: 'single';
  url?: string;
  options?: RedisOptions;
}

export interface RedisClusterOptions {
  type: 'cluster';
  nodes: ClusterNode[];
  options?: ClusterOptions;
}

export type RedisModuleOptions = RedisSingleOptions | RedisClusterOptions;

export interface RedisModuleOptionsFactory {
  createRedisModuleOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<RedisModuleOptionsFactory>;
  useExisting?: Type<RedisModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
