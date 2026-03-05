import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';
import { TaskService } from './task.service';
import { UpdateTaskRequestDto } from './update-task-request.dto';
import { getPositiveNumericValue } from 'src/utils';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() newTask: NewTaskRequestDto) {
    const createdTask = await this.taskService.create(newTask);
    return createdTask;
  }

  @Patch('/:id')
  async update(
    @Body() taskContent: UpdateTaskRequestDto,
    @Param('id') id: string | null,
  ) {
    if (!taskContent || Object.keys(taskContent).length === 0) {
      throw new BadRequestException(
        "It's necessary to define, at least, one field to update",
      );
    }

    const numericId = getPositiveNumericValue(id, 'id');

    const updatedTask = await this.taskService.updatePartial(
      numericId,
      taskContent,
    );

    if (!updatedTask) {
      throw new NotFoundException();
    }

    return updatedTask;
  }
}
