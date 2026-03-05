import {
  Priority,
  type PriorityEnum,
  TaskStatus,
  type TaskStatusEnum,
} from 'src/enums';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({
    name: 'assignee_id',
  })
  assignee: User | null;

  @Column({ name: 'assignee_id', nullable: true })
  assigneeId?: number | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  updatedAt?: Date | null;
}
