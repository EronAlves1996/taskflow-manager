import { BaseTaskDto } from './base-task.dto';

export class NewTaskResponseDto extends BaseTaskDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}
