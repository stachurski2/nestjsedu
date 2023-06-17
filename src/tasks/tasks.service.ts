import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTasks(status?: TaskStatus, keyword?: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks(status, keyword);
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task = this.tasksRepository.create({ ...createTaskDto });
    task.status = TaskStatus.OPEN;
    this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    if (this.checkIfValidUUID(id)) {
      const result = await this.tasksRepository.delete({ id: id });
      if(result.affected < 1){
        throw new NotFoundException(`did not find the object with id ${id}`);
      }
    } else {
      throw new BadRequestException(`id ${id} is not uuid`);
    }
  }

  async getTaskById(id: string): Promise<Task> {
    if (!this.checkIfValidUUID(id)) {
      throw new BadRequestException();
    }

    const task = await this.tasksRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`did not find the object with id ${id}`);
    }
    return task;
  }

  async updateTask(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    if (!this.checkIfValidUUID(id)) {
      throw new BadRequestException(`id ${id} is not uuid`);
    }
    const task = await this.getTaskById(id);
    task.status = updateTaskStatusDto.status;
    this.tasksRepository.save(task);
    return task;
  }
  
   private checkIfValidUUID(str): boolean {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  
    return regexExp.test(str);
  }
}
