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

  constructor(props?: {
    title: string;
    status: TaskStatusEnum;
    priority: PriorityEnum;
  }) {
    if (props) {
      this.title = props.title;
      this.status = props.status;
      this.priority = props.priority;
    }
  }
}
