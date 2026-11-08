import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { AuthService } from './auth.service.js'; // Убрали .js
import { DRIZZLE } from '../db/database.module.js'; // Убрали .js

describe('AuthService', () => {
  let authService: AuthService;
  
  // Создаем мок базы данных, полностью соответствующий синтаксису Drizzle ORM
  const mockDatabaseService = {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 'user-123', email: 'test@example.com' }]),
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DRIZZLE, useValue: mockDatabaseService }, 
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn().mockResolvedValue('fake-token-123'),
            sign: vi.fn().mockReturnValue('fake-token-123'),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('should create new user and return JWT token', async () => {
      const mockDto = { email: 'test@example.com', password: 'password123' };
      
      // Настраиваем: пользователь не найден, значит можно регистрировать
      mockDatabaseService.query.users.findFirst.mockResolvedValue(null);

      const result = await authService.signup(mockDto);

      expect(result.accessToken).toBe('fake-token-123');
      // Проверяем, что Drizzle-методы для создания записи были вызваны
      expect(mockDatabaseService.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      const mockDto = { email: 'existing@example.com', password: 'password123' };
      
      // Настраиваем: пользователь найден -> симулируем конфликт
      mockDatabaseService.query.users.findFirst.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await expect(authService.signup(mockDto)).rejects.toThrow(ConflictException);
    });
  });
});
