import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogsService } from './logs.service.js';

@UseGuards(AuthGuard('jwt'))
@Controller('monitors')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get(':id/logs')
  async getLogs(
    @Req() req: any,
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const userId = req.user.userId;
    return this.logsService.getMonitorLogs(
      userId,
      id,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id/stats')
  async getStats(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.logsService.getMonitorStats(userId, id);
  }
}
