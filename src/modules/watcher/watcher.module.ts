import { Logger, Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';
import { EquifaxRepository, ManagerService } from '../manager/manager.service';

@Module({
  providers: [WatcherService, ManagerService, EquifaxRepository, Logger],
  controllers: [WatcherController],
})
export class WatcherModule {}
