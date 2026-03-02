import { Length, IsIn } from 'class-validator';
import {
  TaskStatus,
  Priority,
  type TaskStatusEnum,
  type PriorityEnum,
} from 'src/enums';

export class BaseTaskDto {
  @Length(5, 100)
  title: string;

  @IsIn(TaskStatus)
  status: TaskStatusEnum;

  @IsIn(Priority)
  priority: PriorityEnum;
}
