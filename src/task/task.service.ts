import { BadRequestException, Injectable } from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDto } from './task.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { UpdateTaskRequestDto } from './update-task-request.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userService: UserService,
  ) {}

  async create(newTask: NewTaskRequestDto) {
    const task = plainToInstance(Task, { ...newTask });

    const savedTask = await this.taskRepository.save(task);

    return plainToInstance(TaskDto, instanceToPlain(savedTask));
  }

  private getUser(id?: number | null) {
    if (!id || id <= 0) {
      return;
    }

    return this.userService.findById(id);
  }

  async updatePartial(id: number, taskContent: Partial<UpdateTaskRequestDto>) {
    const existentTask = await this.taskRepository.find({
      where: { id },
      take: 1,
    });

    if (existentTask.length === 0) {
      return;
    }

    const [task] = existentTask;

    if (taskContent.assignee === null) {
      task.assigneeId = null;
    }

    // loose equality check
    if (taskContent.assignee != null) {
      const user = await this.getUser(taskContent.assignee);

      if (!user) {
        throw new BadRequestException("User don't exists");
      }

      task.assigneeId = user.id;
    }

    if (taskContent.title != null) {
      task.title = taskContent.title;
    }

    if (taskContent.priority != null) {
      task.priority = taskContent.priority;
    }

    if (taskContent.status != null) {
      task.status = taskContent.status;
    }

    const updatedTask = await this.taskRepository.save(task);
    return Object.assign(new TaskDto(), updatedTask);
  }
}
