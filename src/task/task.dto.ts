import { PriorityEnum, TaskStatusEnum } from 'src/enums';
import { BaseTaskDto } from './base-task.dto';

export class TaskDto extends BaseTaskDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;

  constructor(props?: {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    title: string;
    status: TaskStatusEnum;
    priority: PriorityEnum;
  }) {
    if (props) {
      const { status, title, priority } = props;
      super({
        status,
        title,
        priority,
      });
      this.id = props.id;
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      return;
    }
    super();
  }
}
