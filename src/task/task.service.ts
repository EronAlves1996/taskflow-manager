import { Injectable } from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewTaskResponseDto } from './new-task-response.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(newTask: NewTaskRequestDto) {
    const task = new Task();

    task.priority = newTask.priority;
    task.status = newTask.status;
    task.title = newTask.title;

    const savedTask = await this.taskRepository.save(task);
    const taskResponse = new NewTaskResponseDto();

    taskResponse.priority = savedTask.priority;
    taskResponse.status = savedTask.status;
    taskResponse.title = savedTask.title;
    taskResponse.createdAt = savedTask.createdAt;
    taskResponse.id = savedTask.id;
    taskResponse.updatedAt = savedTask.updatedAt;

    return taskResponse;
  }
}
