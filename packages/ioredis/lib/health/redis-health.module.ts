import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health.indicator';
import { redisHealthIndicatorProvider } from './redis-health.provider';

@Module({
  imports: [TerminusModule],
  providers: [redisHealthIndicatorProvider, RedisHealthIndicator],
  exports: [RedisHealthIndicator],
})
export class RedisHealthModule {}
