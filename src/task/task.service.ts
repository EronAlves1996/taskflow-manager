import { Injectable } from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NewTaskResponseDto } from './new-task-response.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(newTask: NewTaskRequestDto) {
    const task = plainToInstance(Task, { ...newTask });

    const savedTask = await this.taskRepository.save(task);

    return plainToInstance(NewTaskResponseDto, instanceToPlain(savedTask));
  }
}
