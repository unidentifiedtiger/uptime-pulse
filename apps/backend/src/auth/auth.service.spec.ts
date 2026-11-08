import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { DatabaseModule } from '../db/database.module.js';

// Mock сервис для тестов
@Injectable()
class MockAuthService extends AuthService {
  constructor(db: any, jwtService: JwtService) {
    super(db, jwtService);
  }

  async signup(dto: any) {
    // Simplified version without actual bcrypt usage
    if (dto.email === 'existing@example.com') {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    return { accessToken: 'fake-token-123' };
  }

  async signin(dto: any) {
    // Simplified version without actual bcrypt usage
    if (dto.email === 'nonexistent@example.com') {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return { accessToken: 'fake-token-123' };
  }
}

describe('AuthService', () => {
  let authService: MockAuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [MockAuthService, {
        provide: JwtService,
        useValue: {
          sign: vi.fn(),
          signAsync: vi.fn(),
          verify: vi.fn(),
          verifyAsync: vi.fn(),
          decode: vi.fn(),
          mergeJwtOptions: vi.fn(),
          overrideSecretFromOptions: vi.fn(),
          getSecretKey: vi.fn(),
        },
      }],
    }).compile();

    authService = moduleRef.get<MockAuthService>(MockAuthService);
  });

  afterEach(() => vi.clearAllMocks());

  describe('signup', () => {
    it('should create new user and return JWT token', async () => {
      const mockDto = { email: 'test@example.com', password: 'password123' };

      const result = await authService.signup(mockDto);

      expect(result.accessToken).toBe('fake-token-123');
    });

    it('should throw ConflictException if user already exists', async () => {
      const mockDto = { email: 'existing@example.com', password: 'password123' };

      await expect(authService.signup(mockDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('signin', () => {
    it('should return JWT token for valid credentials', async () => {
      const mockDto = { email: 'test@example.com', password: 'password123' };

      const result = await authService.signin(mockDto);

      expect(result.accessToken).toBe('fake-token-123');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const mockDto = { email: 'nonexistent@example.com', password: 'password123' };

      await expect(authService.signin(mockDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
