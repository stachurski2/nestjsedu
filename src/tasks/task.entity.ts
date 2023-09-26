import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @ApiProperty({ example: 'c2dfbd07-3424-4d59-b737-fb208f3f7ffb' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'title example' })
  @Column()
  title: string;

  @ApiProperty({ example: 'description example' })
  @Column()
  description: string;

  @ApiProperty({ example: 'OPEN' })
  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
