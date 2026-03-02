import {
  Priority,
  type PriorityEnum,
  TaskStatus,
  type TaskStatusEnum,
} from 'src/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: TaskStatus, enumName: 'task_status' })
  status: TaskStatusEnum;

  @Column({ type: 'enum', enum: Priority, enumName: 'priority' })
  priority: PriorityEnum;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date;
}
