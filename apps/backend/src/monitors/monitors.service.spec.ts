import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MonitorsService } from './monitors.service.js';
import { DatabaseModule } from '../db/database.module.js';

describe('MonitorsService', () => {
  let service: MonitorsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [MonitorsService],
    }).compile();

    service = moduleRef.get<MonitorsService>(MonitorsService);
  });

  afterEach(() => vi.clearAllMocks());

  describe('create', () => {
    it('should create a new monitor and return it', async () => {
      const userId = 'user-123';
      const dto = { name: 'Test API', url: 'https://api.example.com', interval: 60, timeout: 5000 };

      service['db'] = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'monitor-456' }]),
          }),
        }),
      };

      const result = await service.create(userId, dto);
      expect(result).toMatchObject({ id: 'monitor-456' });
    });
  });

  describe('findAllByUser', () => {
    it('should return all monitors for the user', async () => {
      const userId = 'user-123';
      
      service['db'] = {
        query: {
          monitors: {
            findMany: vi.fn().mockResolvedValue([
              { id: 'monitor-1', name: 'API 1', url: 'https://api1.com' },
              { id: 'monitor-2', name: 'API 2', url: 'https://api2.com' },
            ]),
          },
        },
      };

      const result = await service.findAllByUser(userId);

      expect(result).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('should remove monitor and return success message', async () => {
      const userId = 'user-123';
      const monitorId = 'monitor-456';

      service['db'] = {
        delete: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: monitorId }]),
          }),
        }),
      };

      const result = await service.remove(userId, monitorId);
      expect(result).toMatchObject({ message: 'Монитор успешно удален' });
    });
  });
});
