import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'; // 1. Добавили правильный импорт Vitest
import { MonitorsService } from './monitors.service.js';
import { DRIZZLE } from '../db/database.module.js'; 

describe('MonitorsService', () => {
  let service: MonitorsService;

  // 3. Создаем единый мок для Drizzle ORM с цепочками вызовов
  const mockDrizzle = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    query: {
      monitors: {
        findMany: vi.fn(),
      },
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorsService,
        // 4. Передаем мок базы данных вместо импорта реального DatabaseModule
        // Замените 'DATABASE_CONNECTION' на токен, который используется у вас в проекте (например, DRIZZLE || PG_CONNECTION)
        { provide: DRIZZLE, useValue: mockDrizzle },
      ],
    }).compile();

    service = moduleRef.get<MonitorsService>(MonitorsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new monitor and return it', async () => {
      const userId = 'user-123';
      const dto = { name: 'Test API', url: 'https://api.example.com', interval: 60, timeout: 5000 };

      // Настраиваем финальный результат цепочки .insert().values().returning()
      mockDrizzle.returning.mockResolvedValue([{ id: 'monitor-456' }]);

      const result = await service.create(userId, dto);
      
      expect(result).toMatchObject({ id: 'monitor-456' });
      expect(mockDrizzle.insert).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all monitors for the user', async () => {
      const userId = 'user-123';
      
      mockDrizzle.query.monitors.findMany.mockResolvedValue([
        { id: 'monitor-1', name: 'API 1', url: 'https://api1.com' },
        { id: 'monitor-2', name: 'API 2', url: 'https://api2.com' },
      ]);

      const result = await service.findAllByUser(userId);

      expect(result).toHaveLength(2);
      expect(mockDrizzle.query.monitors.findMany).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove monitor and return success message', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      mockDrizzle.returning.mockResolvedValue([{ id: monitorId }]);

      const result = await service.remove(userId, monitorId);
      
      expect(result).toMatchObject({ message: 'Монитор успешно удален' });
    });
  });
});
