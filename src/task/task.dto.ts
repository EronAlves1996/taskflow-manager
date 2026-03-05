import { BaseTaskDto } from './base-task.dto';

export class TaskDto extends BaseTaskDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}
