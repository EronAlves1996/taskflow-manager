import { Body, Controller, Post } from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() newTask: NewTaskRequestDto) {
    const createdTask = await this.taskService.create(newTask);
    return createdTask;
  }
}
