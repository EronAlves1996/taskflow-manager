/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskModule } from './task.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import request from 'supertest';
import { UserModule } from 'src/user/user.module';
import { mockRepositoryFactory } from 'src/mock.test';
import { User } from 'src/user/user.entity';

function taskRepositoryMockFactory() {
  return {
    save: jest.fn((entity: any) => ({
      ...entity,
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };
}

describe('TaskModule', () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeAll(async () => {
    const repositoryToken = getRepositoryToken(Task);
    const module: TestingModule = await Test.createTestingModule({
      imports: [TaskModule, UserModule],
    })
      .overrideProvider(repositoryToken)
      .useFactory({
        factory: taskRepositoryMockFactory,
      })
      .overrideProvider(getRepositoryToken(User))
      .useFactory({
        factory: mockRepositoryFactory,
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    repository = module.get(repositoryToken);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createTask = () => request(app.getHttpServer()).post('/tasks');

  it('should create a task under mock correctly', () => {
    const requestBody = {
      title: 'Titulo teste',
      status: 'pending',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .expect((response) => {
        const body = response?.body;
        expect(body?.title).toBe(requestBody.title);
        expect(body?.status).toBe(requestBody.status);
        expect(body?.priority).toBe(requestBody.priority);
        expect(body?.id).toBe(1);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(repository.save).toHaveBeenCalled();
      });
  });

  it('should return validation error when no title', () => {
    const requestBody = {
      status: 'pending',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'title must be longer than or equal to 5 characters',
        );
      });
  });

  it('should return validation error when title have less than 5 characters', () => {
    const requestBody = {
      title: 'test',
      status: 'pending',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'title must be longer than or equal to 5 characters',
        );
      });
  });

  it('should return validation error when title have more than 100 characters', () => {
    const requestBody = {
      title:
        '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
      status: 'pending',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'title must be shorter than or equal to 100 characters',
        );
      });
  });

  it('should return validation error when status is not defined', () => {
    const requestBody = {
      title: 'teste',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'status must be one of the following values: pending, in-progress, completed',
        );
      });
  });

  it('should return validation error when status is not in enum value', () => {
    const requestBody = {
      title: 'teste',
      status: 'blablbala',
      priority: 'low',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'status must be one of the following values: pending, in-progress, completed',
        );
      });
  });

  it('should return validation error when priority is not defined', () => {
    const requestBody = {
      title: 'teste',
      status: 'pending',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'priority must be one of the following values: low, medium, high, urgent',
        );
      });
  });

  it('should return validation error when priority is not in enum value', () => {
    const requestBody = {
      title: 'teste',
      status: 'pending',
      priority: 'balbala',
    };
    return createTask()
      .send(requestBody)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response) => {
        const messages = response?.body?.message;
        expect(messages).toHaveLength(1);
        expect(messages[0]).toBe(
          'priority must be one of the following values: low, medium, high, urgent',
        );
      });
  });
});
