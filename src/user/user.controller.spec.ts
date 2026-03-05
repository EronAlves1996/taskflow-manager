import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;

  let userIds = 1;
  const userRepositoryMockFactory = () => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    save: jest.fn((entity: any) => ({
      ...entity,
      id: userIds++,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    create: (base?: unknown) => {
      const user = new User();
      if (!base) {
        return user;
      }
      return Object.assign(user, base);
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(User)) {
          return userRepositoryMockFactory();
        }
      })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create correctly a well defined user', async () => {
    const userName = 'José João';
    const created = await controller.create({ name: userName });
    expect(created.id).toBe(1);
    expect(created.name).toBe(userName);
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();
  });
});
