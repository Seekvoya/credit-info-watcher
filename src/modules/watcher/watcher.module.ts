import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';
import { ManagerService } from '../manager/manager.service';

@Module({
  providers: [WatcherService, ManagerService],
  controllers: [WatcherController],
})
export class WatcherModule {}
