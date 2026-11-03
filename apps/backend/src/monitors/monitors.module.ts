import { Module } from '@nestjs/common';
import { MonitorsService } from './monitors.service.js';
import { MonitorsController } from './monitors.controller.js';
import { LogsController } from './logs.controller.js';
import { LogsService } from './logs.service.js';
import { StatusController } from './status.controller.js';



@Module({
  controllers: [MonitorsController, LogsController, StatusController],
  providers: [MonitorsService, LogsService],
  exports: [MonitorsService, LogsService],
})
export class MonitorsModule { }
