import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { UsersRepository } from '../../auth/users.repository'

describe('AuthController', () => {
  
  let authService: AuthService;
  let usersRepository;
  
  const mockUsersRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
  });
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();
    authService = await module.get(AuthService);
    usersRepository = await module.get(UsersRepository);
  });
  
  it('someTest', async () => {
    expect(true).toEqual(true);
  });
})