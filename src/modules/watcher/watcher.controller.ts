import { Controller, Get, Query } from '@nestjs/common';
import { WatcherService } from './watcher.service';

@Controller('watcher')
export class WatcherController {
  constructor(private readonly watcher: WatcherService) {}

  @Get()
  async getClientCreditInfoByUID(@Query() searchParam: number, bool?: boolean) {
    return this.watcher.getClientCreditInfoById(searchParam, bool);
  }
}
