import { Body, Controller, Get, Post, Param, Query, Delete, Patch, UseGuards } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskWithFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskWithFilterDto, @GetUser() user: User) {
    const { status, keyword } = filterDto;
    return this.tasksService.getTasks(user, status, keyword);
  }

  @Get('/task/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user)
  }

  @ApiQuery({name:'id', type:'string'})
  @Get('/getby')
  getTaskBy(@Query('id') id, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  @ApiQuery({name:'id', type:'string'})
  @Delete('/delete')
  deleteTask(@Query('id') id, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user);
  }

  @ApiBody({ type: CreateTaskDto })
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @ApiBody({ type: UpdateTaskStatusDto })
  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTask(id, updateTaskStatusDto, user);
  }
}
