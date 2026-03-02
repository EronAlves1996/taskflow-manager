import { Length, IsIn } from 'class-validator';
import { TaskStatus, Priority } from 'src/enums';

export class BaseTaskDto {
  @Length(5, 100)
  title: string;

  @IsIn(TaskStatus)
  status: string;

  @IsIn(Priority)
  priority: string;
}
