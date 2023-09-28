import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { UsersRepository } from '../../auth/users.repository'

const mockUsersRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
describe('AuthController', () => {
  let authController: AuthController;
  let usersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();
    authController = await module.get(AuthController);
    usersRepository = await module.get(UsersRepository);
  });
  it('someTest', async () => {
    expect(true).toEqual(true);
  });
});
