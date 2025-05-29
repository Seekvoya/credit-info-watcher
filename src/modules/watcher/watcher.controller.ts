import { Controller, Get, Query } from '@nestjs/common';
import { WatcherService } from './watcher.service';

@Controller('watcher')
export class WatcherController {
  constructor(private readonly watcher: WatcherService) {}

  @Get()
  async getClientCredinInfoByUID(@Query() query: string) {
    return await this.watcher.getClientCredinInfoByUID(query);
  }
}
