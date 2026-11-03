import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, UsePipes, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonitorsService } from './monitors.service.js';
import { type CreateMonitorDto, createMonitorSchema } from './dto/monitor.dto.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';
import { type UpdateMonitorDto, updateMonitorSchema } from './dto/update-monitor.dto.js';

@UseGuards(AuthGuard('jwt'))
@Controller('monitors')
export class MonitorsController {
  constructor(
    private readonly monitorsService: MonitorsService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createMonitorSchema))
  async create(@Req() req: any, @Body() dto: CreateMonitorDto) {
    const userId = req.user.userId;
    return this.monitorsService.create(userId, dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return this.monitorsService.findAllByUser(userId);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.monitorsService.remove(userId, id);
  }

  @Patch(':id/toggle')
  async toggleMonitor(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.monitorsService.toggleMonitorStatus(userId, id);
  }

  @Patch(':id')
  async updateMonitor(
    @Req() req: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateMonitorSchema)) dto: UpdateMonitorDto,
  ) {
    const userId = req.user.userId;
    return this.monitorsService.updateMonitor(userId, id, dto);
  }

}
