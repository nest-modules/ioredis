import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CatsModule } from './cats/cats.module';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    CoreModule,
    CatsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
