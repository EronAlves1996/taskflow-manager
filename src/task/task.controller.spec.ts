import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { UserModule } from 'src/user/user.module';
import { mockRepositoryFactory } from 'src/mock.test';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useFactory({ factory: mockRepositoryFactory })
      .useMocker((token) => {
        if (token === getRepositoryToken(Task)) {
          return mockRepositoryFactory();
        }
      })
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
