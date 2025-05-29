import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';

@Module({
  providers: [WatcherService],
  controllers: [WatcherController],
})
export class WatcherModule {}
