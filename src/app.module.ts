import { Module } from '@nestjs/common';
import { WatcherModule } from './modules/watcher/watcher.module';

@Module({
  imports: [WatcherModule],
})
export class AppModule {}
