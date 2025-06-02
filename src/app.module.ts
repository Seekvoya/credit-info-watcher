import { Module } from '@nestjs/common';
import { WatcherModule } from './modules/watcher/watcher.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerModule } from './modules/manager/manager.module';
import { ManagerController } from './modules/manager/manager.controller';
import { ManagerService } from './modules/manager/manager.service';
import TypeOrmConfigService from './config/ormConfig';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    WatcherModule,
    ManagerModule,
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class AppModule {}
