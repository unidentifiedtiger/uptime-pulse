import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, desc, SQLWrapper } from 'drizzle-orm';
import { DRIZZLE } from '../db/database.module.js';
import { monitors, monitorLogs} from '../db/schema.js';
import { CreateMonitorDto } from './dto/monitor.dto.js';

@Injectable()
export class MonitorsService {
  constructor(@Inject(DRIZZLE) private db: any) {}

  async create(userId: string, dto: CreateMonitorDto) {
    const [newMonitor] = await this.db
      .insert(monitors)
      .values({
        userId,
        name: dto.name,
        url: dto.url,
        interval: dto.interval,
        timeout: dto.timeout,
      })
      .returning();

    return newMonitor;
  }

  async findAllByUser(userId: string) {
    return await this.db.query.monitors.findMany({
      where: eq(monitors.userId, userId),
    });
  }

  async remove(userId: string, monitorId: string) {
    const [deletedMonitor] = await this.db
      .delete(monitors)
      .where(and(eq(monitors.id, monitorId), eq(monitors.userId, userId)))
      .returning();

    if (!deletedMonitor) {
      throw new NotFoundException('Монитор не найден или у вас нет прав');
    }

    return { message: 'Монитор успешно удален' };
  }

  async toggleMonitorStatus(userId: string, monitorId: string) {
  // Находим монитор и проверяем права
  const monitor = await this.db.query.monitors.findFirst({
    where: and(eq(monitors.id, monitorId), eq(monitors.userId, userId)),
  });

  if (!monitor) {
    throw new NotFoundException('Монитор не найден');
  }

  // Инвертируем текущий статус
  const updated = await this.db
    .update(monitors)
    .set({ isActive: !monitor.isActive, updatedAt: new Date() })
    .where(eq(monitors.id, monitorId))
    .returning();

  return updated[0];
}

async updateMonitor(
  userId: string, 
  monitorId: string, 
  dto: { name?: string; interval?: number; timeout?: number; isPublic?: boolean }
) {
  const monitor = await this.db.query.monitors.findFirst({
    where: and(eq(monitors.id, monitorId), eq(monitors.userId, userId)),
  });

  if (!monitor) {
    throw new NotFoundException('Монитор не найден');
  }

  const updated = await this.db
    .update(monitors)
    .set({
      ...dto,
      updatedAt: new Date(),
    })
    .where(eq(monitors.id, monitorId))
    .returning();

  return updated[0];
}


async getPublicStatusPage(userId: string) {
  // 1. Находим только публичные мониторы пользователя
  const publicMonitors = await this.db.query.monitors.findMany({
    where: and(
      eq(monitors.userId, userId),
      eq(monitors.isPublic, true)
    ),
  });

  if (!publicMonitors.length) {
    return {
      overallStatus: 'operational',
      monitors: [],
    };
  }

  // 2. Для каждого монитора берем последнюю проверку
  const monitorsWithStats = await Promise.all(
    publicMonitors.map(async (monitor: { id: string | SQLWrapper; name: any; url: any; isActive: any; }) => {
      const lastLog = await this.db.query.monitorLogs.findFirst({
        where: eq(monitorLogs.monitorId, monitor.id),
        orderBy: [desc(monitorLogs.checkedAt)],
      });

      return {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        isActive: monitor.isActive,
        isUp: lastLog ? lastLog.isUp : true,
        responseTime: lastLog ? lastLog.responseTime : 0,
        lastChecked: lastLog ? lastLog.checkedAt : null,
      };
    })
  );

  const hasOutage = monitorsWithStats.some((m) => m.isActive && !m.isUp);
  const overallStatus = hasOutage ? 'degraded' : 'operational';

  return {
    overallStatus,
    monitors: monitorsWithStats,
  };
}


}
