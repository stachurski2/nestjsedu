import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: 'testId',
  username: 'testUsername',
  password: 'testPassword',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    taskService = await module.get(TasksService);
    taskRepository = await module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(mockUser, null, null);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTask', () => {
    it('with success', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      taskRepository.findOne.mockResolvedValue('someValue');
      const result = await taskService.getTaskById(
        '8a6e0804-2bd0-4672-b79d-d97027f9071a',
        mockUser,
      );
      expect(taskRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });

    it('with failure', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});