import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../auth/users.repository';
import { AuthModule } from '../../auth/auth.module';
import { TasksController } from '../../tasks/tasks.controller';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';
import { TaskStatus } from '../../tasks/task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUsersRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 'testId',
  username: 'testUsername',
  password: 'testPassword',
  tasks: [],
};

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
    it('check get tasks call"', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      const someTaskStatus = TaskStatus.OPEN
      const someTaskKeyword = 'someKeyword'

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const result = await taskController.getTasks(
        { status: someTaskStatus, keyword: someTaskKeyword },
        mockUser,
      );
      expect(result).toEqual('someValue');
      expect(taskRepository.getTasks).toHaveBeenCalledWith(
        mockUser,
        someTaskStatus,
        someTaskKeyword,
      );
    });
  });
});
