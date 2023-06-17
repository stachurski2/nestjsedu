import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskWithFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(status?: TaskStatus, keyword?: string): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (keyword) {
      query.andWhere(
        `LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)`,
        { search: `%${keyword}` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
4