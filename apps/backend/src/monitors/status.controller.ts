import { Controller, Get, Param } from '@nestjs/common';
import { MonitorsService } from './monitors.service.js';

@Controller('monitors/public')
export class StatusController {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Get(':userId')
  async getPublicStatus(@Param('userId') userId: string) {
    return this.monitorsService.getPublicStatusPage(userId);
  }
}
