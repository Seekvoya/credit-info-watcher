import { Logger, Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';
import { ManagerService } from '../manager/manager.service';
import { EquifaxRepository } from '../manager/repository/equifax-repository';

@Module({
  providers: [WatcherService, ManagerService, EquifaxRepository, Logger],
  controllers: [WatcherController],
})
export class WatcherModule {}
