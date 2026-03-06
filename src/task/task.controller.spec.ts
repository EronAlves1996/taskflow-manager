import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { UserModule } from 'src/user/user.module';
import { mockRepositoryFactory } from 'src/mock.test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserController } from 'src/user/user.controller';
import { UserDto } from 'src/user/user.dto';
import { PriorityEnum, TaskStatusEnum } from 'src/enums';

describe('TaskController', () => {
  let controller: TaskController;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useFactory({
        factory: () => ({
          ...mockRepositoryFactory(),
          create: (p: UserDto) => Object.assign(new User(), p),
        }),
      })
      .useMocker((token) => {
        if (token === getRepositoryToken(Task)) {
          return mockRepositoryFactory();
        }
      })
      .compile();

    controller = module.get<TaskController>(TaskController);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should validate no key task content', async () => {
    await expect(() => controller.update({}, null)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should try to update non existent task', async () => {
    await expect(() =>
      controller.update({ status: 'pending' }, '1'),
    ).rejects.toThrow(NotFoundException);
  });

  const createTask = () => {
    return controller.create({
      title: 'Teste titulo',
      priority: 'low',
      status: 'pending',
    });
  };

  const createUser = () => userController.create({ name: 'José geraldo' });

  it('should update assignee to existent assignee', async () => {
    const { id: taskId, updatedAt, title } = await createTask();
    const { id } = await createUser();
    const response = await controller.update({ assignee: id }, String(taskId));

    expect(response.title).toBe(title);
    expect(response.updatedAt).not.toBe(updatedAt);
  });

  it('should try update assignee to non existent', async () => {
    const { id: taskId } = await createTask();
    await expect(() =>
      controller.update({ assignee: 4 }, String(taskId)),
    ).rejects.toThrow(BadRequestException);
  });

  it('should remove assignee', async () => {
    const { id: taskId, updatedAt, title } = await createTask();
    const { id } = await createUser();
    const response = await controller.update({ assignee: id }, String(taskId));

    expect(response.title).toBe(title);
    expect(response.updatedAt).not.toBe(updatedAt);

    const response2 = await controller.update(
      { assignee: null },
      String(taskId),
    );

    expect(response2.updatedAt).not.toBe(response.updatedAt);
  });

  it('should update title', async () => {
    const { id: taskId, updatedAt } = await createTask();
    const newTitle = 'Teste 33';
    const response = await controller.update(
      { title: newTitle },
      String(taskId),
    );

    expect(response.id).toBe(taskId);
    expect(response.title).toBe(newTitle);
    expect(response.updatedAt).not.toBe(updatedAt);
  });

  it('should update priority', async () => {
    const { id: taskId, updatedAt } = await createTask();
    const newPriority: PriorityEnum = 'high';
    const response = await controller.update(
      { priority: newPriority },
      String(taskId),
    );

    expect(response.id).toBe(taskId);
    expect(response.priority).toBe(newPriority);
    expect(response.updatedAt).not.toBe(updatedAt);
  });

  it('should update status', async () => {
    const { id: taskId, updatedAt } = await createTask();
    const newStatus: TaskStatusEnum = 'completed';
    const response = await controller.update(
      { status: newStatus },
      String(taskId),
    );

    expect(response.id).toBe(taskId);
    expect(response.status).toBe(newStatus);
    expect(response.updatedAt).not.toBe(updatedAt);
  });
});
