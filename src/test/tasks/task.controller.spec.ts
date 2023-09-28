import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../auth/users.repository';
import { AuthModule } from '../../auth/auth.module';
import { TasksController } from '../../tasks/tasks.controller';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';
import { TaskStatus } from '../../tasks/task-status.enum';
import { BadRequestException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
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
        { provide: UsersRepository, useFactory: mockUsersRepository }
      ],
    }).compile();
    taskController = await module.get(TasksController)
    taskRepository = await module.get(TasksRepository);
  });

  describe('root', () => {
    it('check get tasks call"', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      const someTaskStatus = TaskStatus.OPEN;
      const someTaskKeyword = 'someKeyword';

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

    it('check get task with id call"', async () => {
      taskRepository.findOne.mockResolvedValue('someValue');

      expect(taskRepository.findOne).not.toHaveBeenCalled();
      const result = await taskController.getTaskById(
        '8a6e0804-2bd0-4672-b79d-d97027f9071a',
        mockUser,
      );
      expect(result).toEqual('someValue');
      expect(taskRepository.findOne).toHaveBeenCalledWith(
        '8a6e0804-2bd0-4672-b79d-d97027f9071a',
      );
    });
    it('check get task with bad id call with failure result', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      expect(taskController.getTaskById('someId', mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('create task with id call"', async () => {
      const testId = 'someId';
      const taskTitle = 'testTitle';
      const taskDescription = 'testDescription';

      expect(taskRepository.save).not.toHaveBeenCalled();
      taskRepository.create.mockResolvedValue({
        id: testId,
        title: taskTitle,
        description: taskDescription,
        status: undefined,
      });

      const result = await taskController.createTask(
        { title: 'testTile', description: 'testDescription'},
        mockUser,
      );
      expect(result.id).toEqual(testId);
      expect(result.title).toEqual(taskTitle);
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.OPEN);
    });

    it('delete task with id call"', async () => {
      const testId = '8a6e0804-2bd0-4672-b79d-d97027f9071a';
      taskRepository.delete.mockResolvedValue({
        id: testId,
      });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await taskController.deleteTask(testId, mockUser);
      expect(taskRepository.delete).toHaveBeenCalled();
    });

    it('update task with id call"', async () => {
      const testId = '8a6e0804-2bd0-4672-b79d-d97027f9071a';
      taskRepository.findOne.mockResolvedValue({
        id: testId,
      });
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      expect(taskRepository.save).not.toHaveBeenCalled();
      const result = await taskController.updateTaskStatus(
        testId,
        { status: TaskStatus.DONE },
        mockUser,
      );
      expect(taskRepository.findOne).toHaveBeenCalled();
      expect(taskRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
