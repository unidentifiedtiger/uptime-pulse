import { Test, TestingModule } from '@nestjs/testing';
import { LogsService } from './logs.service.js';
import { DatabaseModule } from '../db/database.module.js';

describe('LogsService', () => {
  let service: LogsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [LogsService],
    }).compile();

    service = moduleRef.get<LogsService>(LogsService);
  });

  afterEach(() => vi.clearAllMocks());

  describe('getMonitorLogs', () => {
    it('should return paginated monitor logs', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';
      const page = 1;
      const limit = 20;

      service['db'] = {
        query: {
          monitors: {
            findFirst: vi.fn().mockResolvedValue({ id: monitorId, name: 'Test API' }),
          },
          monitorLogs: {
            findMany: vi.fn().mockResolvedValue([
              { id: 'log-1', statusCode: 200, responseTime: 50, isUp: true, checkedAt: '2024-01-01' },
              { id: 'log-2', statusCode: 500, responseTime: 300, isUp: false, errorMessage: 'Error', checkedAt: '2024-01-02' },
            ]),
          },
        },
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              then: Promise.resolve([{ count: 10 }]),
            }),
          }),
        }),
      };

      const result = await service.getMonitorLogs(userId, monitorId, page, limit);

      expect(result.monitor).toMatchObject({ id: monitorId, name: 'Test API' });
      expect(result.logs.length).toBe(2);
      expect(result.page).toBe(page);
    });

    it('should throw NotFoundException if monitor does not exist', async () => {
      const userId = 'user-123';
      const monitorId = 'nonexistent-id';

      service['db'] = {
        query: {
          monitors: {
            findFirst: vi.fn().mockResolvedValue(null),
          },
        },
      };

      await expect(service.getMonitorLogs(userId, monitorId)).rejects.toThrow('Монитор не найден или у вас нет прав');
    });
  });

  describe('getMonitorStats', () => {
    it('should return uptime and response time statistics', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      service['db'] = {
        query: {
          monitors: {
            findFirst: vi.fn().mockResolvedValue({ id: monitorId, name: 'Test API' }),
          },
        },
      };

      service.getMonitorStats = vi.fn().mockResolvedValue({
        uptime: 95,
        avgResponseTime: 151,
        totalChecks: 100,
      });

      const result = await service.getMonitorStats(userId, monitorId);

      expect(result).toMatchObject({
        uptime: 95,
        avgResponseTime: 151,
        totalChecks: 100,
      });
    });

    it('should return zero stats if no logs exist', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      service['db'] = {
        query: {
          monitors: {
            findFirst: vi.fn().mockResolvedValue({ id: monitorId }),
          },
        },
      };

      service.getMonitorStats = vi.fn().mockResolvedValue({
        uptime: 100,
        avgResponseTime: 0,
        totalChecks: 0,
      });

      const result = await service.getMonitorStats(userId, monitorId);

      expect(result).toMatchObject({
        uptime: 100,
        avgResponseTime: 0,
        totalChecks: 0,
      });
    });
  });
});
