import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    @InjectRepository(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) {}

  async getTasks(
    user: User,
    status?: TaskStatus,
    keyword?: string,
  ): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks(user, status, keyword);
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Task {
    const task = this.tasksRepository.create({ ...createTaskDto, user: user });
    task.status = TaskStatus.OPEN;
    this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    console.log(user)
    console.log(id)
    if (this.checkIfValidUUID(id)) {
      const result = await this.tasksRepository.delete({ id: id, user: user });
      if(result.affected < 1){
        throw new NotFoundException(`did not find the object with id ${id}`);
      }
    } else {
      throw new BadRequestException(`id ${id} is not uuid`);
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
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
    user: User,
  ): Promise<Task> {
    console.log(user)
    if (!this.checkIfValidUUID(id)) {
      throw new BadRequestException(`id ${id} is not uuid`);
    }
    const task = await this.getTaskById(id, user);
    console.log(task)

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
