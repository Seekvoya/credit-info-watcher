import { Module } from '@nestjs/common';
import { WatcherModule } from './modules/watcher/watcher.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from './config/ormConfig';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    WatcherModule,
  ],
})
export class AppModule {}
