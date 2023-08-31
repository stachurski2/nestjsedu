import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('Task Repository');
  async getTasks(
    user: User,
    status?: TaskStatus,
    keyword?: string,
  ): Promise<Task[]> {
    this.logger.verbose(
      `preparing query for status:${status} keyword:${keyword} and user ${user.username}`,
    );
    try {
      const query = this.createQueryBuilder('task');
      query.where({ user });
      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      if (keyword) {
        query.andWhere(
          'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
          { search: `%${keyword}` },
        );
      }

      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `task for query: status:${status} keyword:${keyword} and user ${user.username} failed due to ${error}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
