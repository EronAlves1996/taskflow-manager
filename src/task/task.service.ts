import { Injectable } from '@nestjs/common';
import { NewTaskRequestDto } from './new-task-request.dto';

@Injectable()
export class TaskService {
  create(newTask: NewTaskRequestDto) {}
}
