import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'node:test';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { UsersRepository } from '../../auth/users.repository'
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authService: AuthService;
  let usersRepository;
  let jwtService; 

  const mockUsersRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createUser: jest.fn(),
  });

  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();
    authService = await module.get(AuthService);
    usersRepository = await module.get(UsersRepository);
    jwtService = await module.get(JwtService);
  });

  it('sign in with success', async () => {
    const mockAccessToken = "testToken"
    const mockUser = { username: 'test', password: 'test'};
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(mockUser.password, salt);
    usersRepository.findOne.mockResolvedValue({
      username: mockUser.username,
      password: hashedpassword,
    });
    jwtService.sign.mockResolvedValue(mockAccessToken)
    const accessToken = await authService.signIn({
      username: mockUser.username,
      password: mockUser.password,
    });
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      username: mockUser.username,
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.username,
    });
    expect(accessToken).toEqual({ accessToken: mockAccessToken });
  });

  it('sign in with failure', async () => {
    const mockUser = { username: 'test', password: 'test'};
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(mockUser.password, salt);
    usersRepository.findOne.mockResolvedValue({
      username: mockUser.username,
      password: hashedpassword,
    });
    expect(
      authService.signIn({
        username: mockUser.username,
        password: `${mockUser.password}s`,
      }),
    ).rejects.toThrow(
      new UnauthorizedException('Please check your login credentials'),
    );
  });
  
  it('sign up with success', async () => {
    const mockUser = { username: 'test', password: 'test' };
    usersRepository.findOne.mockResolvedValue(null);
    usersRepository.createUser.mockResolvedValue(mockUser);

    await authService.signUp({
      username: mockUser.username,
      password: mockUser.password,
    });
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      username: mockUser.username,
    });
    expect(usersRepository.createUser).toHaveBeenCalled();
  });

  it('sign up with failure', async () => {
    const mockUser = { username: 'test', password: 'test' };
    usersRepository.findOne.mockResolvedValue(mockUser);
    usersRepository.createUser.mockResolvedValue(mockUser);

    expect(
      authService.signUp({
        username: mockUser.username,
        password: mockUser.password,
      }),
    ).rejects.toThrow(new ConflictException('user already exits'));
  
  });
});