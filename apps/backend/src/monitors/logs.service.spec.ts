import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { LogsService } from './logs.service.js';
import { DRIZZLE } from '../db/database.module.js';

describe('LogsService', () => {
  let service: LogsService;

  // Создаем базовую структуру мока Drizzle ORM
  const mockDrizzle = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    query: {
      monitors: {
        findFirst: vi.fn(),
      },
      monitorLogs: {
        findMany: vi.fn(),
      },
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        { provide: DRIZZLE, useValue: mockDrizzle },
      ],
    }).compile();

    service = moduleRef.get<LogsService>(LogsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMonitorLogs', () => {
    it('should return paginated monitor logs', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      // 1. Настраиваем поиск монитора
      mockDrizzle.query.monitors.findFirst.mockResolvedValue({ id: monitorId, name: 'Test API' });
      
      // 2. Настраиваем вывод списка логов
      mockDrizzle.query.monitorLogs.findMany.mockResolvedValue([
        { id: 'log-1', statusCode: 200, responseTime: 50, isUp: true },
        { id: 'log-2', statusCode: 500, responseTime: 300, isUp: false },
      ]);

      // 3. Изолируем цепочку select().from().where() конкретно для этого теста (кастомный query builder)
      const mockWhere = vi.fn().mockResolvedValue([{ count: 10 }]);
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      mockDrizzle.select.mockReturnValue({ from: mockFrom });

      const result = await service.getMonitorLogs(userId, monitorId, 1, 20);

      expect(result.monitor).toMatchObject({ id: monitorId, name: 'Test API' });
      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should throw NotFoundException if monitor does not exist', async () => {
      mockDrizzle.query.monitors.findFirst.mockResolvedValue(null);

      await expect(service.getMonitorLogs('user-123', 'fake-id', 1, 20))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('getMonitorStats', () => {
    it('should return uptime and response time statistics calculated from logs', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      // 1. Настраиваем успешный поиск монитора
      mockDrizzle.query.monitors.findFirst.mockResolvedValue({ id: monitorId, name: 'Test API' });

      // 2. Изолируем цепочку вызовов под агрегацию статистики (stats)
      // Симулируем, что база вернула массив из одного объекта с результатами агрегатных функций
      const mockWhere = vi.fn().mockResolvedValue([
        {
          totalChecks: 3,
          successfulChecks: 2,
          avgResponseTime: 100,
        }
      ]);
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      mockDrizzle.select.mockReturnValue({ from: mockFrom });

      const result = await service.getMonitorStats(userId, monitorId);

      // 3. Проверяем математические расчеты вашего сервиса на основе этих данных
      expect(result.totalChecks).toBe(3);
      expect(result.avgResponseTime).toBe(100);
      expect(result.uptime).toBeCloseTo(66.67, 1); // 2 успешных из 3 = 66.67%
    });
  });
});
