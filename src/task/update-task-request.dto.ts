import { IsNumber, IsOptional } from 'class-validator';
import { BaseTaskDto } from './base-task.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTaskRequestDto extends PartialType(BaseTaskDto) {
  @IsNumber()
  @IsOptional()
  assignee?: number | null;
}
