import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../db/database.module.js';
import { monitors } from '../db/schema.js';

@Injectable()
export class PingerScheduler {
  constructor(
    @Inject(DRIZZLE) private db: any,
    @InjectQueue('pinger-queue') private pingerQueue: Queue,
  ) {}

  // Запускается каждую минуту
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const activeMonitors = await this.db.query.monitors.findMany({
      where: eq(monitors.isActive, true),
    });

    for (const monitor of activeMonitors) {
      await this.pingerQueue.add(
        'ping-job',
        {
          monitorId: monitor.id,
          url: monitor.url,
          timeout: monitor.timeout,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }
  }
}
