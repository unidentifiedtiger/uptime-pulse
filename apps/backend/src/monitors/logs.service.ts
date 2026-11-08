import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, desc, and, sql } from 'drizzle-orm';
import { DRIZZLE } from '../db/database.module.js';
import { monitors, monitorLogs } from '../db/schema.js';

@Injectable()
export class LogsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async getMonitorLogs(userId: string, monitorId: string, page = 1, limit = 20) {
    const monitor = await this.db.query.monitors.findFirst({
      where: and(eq(monitors.id, monitorId), eq(monitors.userId, userId)),
    });

    if (!monitor) {
      throw new NotFoundException('Монитор не найден или у вас нет прав');
    }

    const offset = (page - 1) * limit;

    const logs = await this.db.query.monitorLogs.findMany({
      where: eq(monitorLogs.monitorId, monitorId),
      orderBy: [desc(monitorLogs.checkedAt)],
      limit,
      offset,
    });

    const totalResult = await this.db
      .select({ count: sql`count(*)` })
      .from(monitorLogs)
      .where(eq(monitorLogs.monitorId, monitorId));

    const total = Number(totalResult[0]?.count || 0);

    return {
      monitor,
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getMonitorStats(userId: string, monitorId: string) {
    const monitor = await this.db.query.monitors.findFirst({
      where: and(eq(monitors.id, monitorId), eq(monitors.userId, userId)),
    });

    if (!monitor) {
      throw new NotFoundException('Монитор не найден или у вас нет прав');
    }

    const [stats] = await this.db
      .select({
        totalChecks: sql<number>`count(*)`,
        successfulChecks: sql<number>`sum(case when ${monitorLogs.isUp} = true then 1 else 0 end)`,
        avgResponseTime: sql<number>`avg(${monitorLogs.responseTime})`,
      })
      .from(monitorLogs)
      .where(eq(monitorLogs.monitorId, monitorId));

    const total = Number(stats?.totalChecks) || 0;
    const success = Number(stats?.successfulChecks) || 0;
    const avgResponse = Math.round(Number(stats?.avgResponseTime) || 0);
    const uptime = total > 0 ? Number(((success / total) * 100).toFixed(2)) : 100;

    return {
      uptime,
      avgResponseTime: avgResponse,
      totalChecks: total,
    };
  }
}
