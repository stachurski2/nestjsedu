import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../auth/users.repository';
import { AuthModule } from '../../auth/auth.module';
import { TasksController } from '../../tasks/tasks.controller';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUsersRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

describe('TaskController', () => {
  let taskController: TasksController;
  let taskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
        AuthModule,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();
    taskController = await module.get(TasksController)
    taskRepository = await module.get(TasksRepository);
  });

  describe('root', () => {
    it('some test example!"', () => {
      expect(true).toBe(true);
    });
  });
});
