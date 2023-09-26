import { Test, TestingModule } from '@nestjs/testing';
import { TasksRepository } from '../../tasks/tasks.repository';
import { TasksService } from '../../tasks/tasks.service';
const mockTasksRepository = () => ({
  getTasks: jest.fn(),
});

const mockUser = {
  id: 'testId',
  username: "testUsername",
  password: "testPassword",
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
});
