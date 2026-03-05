import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  const userRepositoryMockFactory = () => {
    const inMemoryDataSource: any[] = [];
    let userIds = 1;

    return {
      save: (entity: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const newEntity = {
          ...entity,
          id: userIds++,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        inMemoryDataSource.push(newEntity);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return newEntity;
      },
      create: (base?: unknown) => {
        const user = new User();
        if (!base) {
          return user;
        }
        return Object.assign(user, base);
      },
      findAndCount({ take, skip }: { take: number; skip: number }) {
        const total = inMemoryDataSource.length;
        const sliced = inMemoryDataSource.slice(skip, skip + take);
        return [sliced, total] as const;
      },
      find({ where: { id } }: { where: { id: number } }) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return inMemoryDataSource.filter(({ id: uid }) => uid === id);
      },
    };
  };

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

  it('should throw error correctly when trying get user with incorrect pagination', () => {
    expect(() => controller.getAll('q2351531')).toThrow(BadRequestException);
  });

  it('should throw error correctly when trying get user with incorrect pagination', () => {
    expect(() => controller.getAll('-5')).toThrow(BadRequestException);
  });

  it('should get page one when no pagination information is passed', async () => {
    for (let i = 0; i < 15; i++) {
      await controller.create({ name: 'Jair das dores' });
    }
    const results = await controller.getAll(null);

    expect(results.page).toBe(1);
    expect(results.pages).toBe(2);
    expect(results.data).toHaveLength(10);

    for (let i = 1; i <= 10; i++) {
      expect(results.data[i - 1].id).toBe(i);
    }
  });

  it('should get pages correctly when information is passed', async () => {
    for (let i = 0; i < 15; i++) {
      await controller.create({ name: 'Jair das dores' });
    }
    const results = await controller.getAll('1');

    expect(results.page).toBe(1);
    expect(results.pages).toBe(2);
    expect(results.data).toHaveLength(10);

    for (let i = 1; i <= 10; i++) {
      expect(results.data[i - 1].id).toBe(i);
    }

    const resultsPage2 = await controller.getAll('2');

    expect(resultsPage2.page).toBe(2);
    expect(resultsPage2.pages).toBe(2);
    expect(resultsPage2.data).toHaveLength(5);

    for (let i = 11; i <= 15; i++) {
      expect(resultsPage2.data[i - 11].id).toBe(i);
    }

    const resultsPage3 = await controller.getAll('3');

    expect(resultsPage3.page).toBe(3);
    expect(resultsPage3.pages).toBe(2);
    expect(resultsPage3.data).toHaveLength(0);
  });

  it('should get a single user correctly', async () => {
    for (let i = 0; i < 15; i++) {
      await controller.create({ name: 'Jair das dores' });
    }

    const user = await controller.findById('4');
    expect(user.id).toBe(4);
  });

  it('should throw 404 when no user found', async () => {
    const test = async () => await controller.findById('4');
    await expect(test()).rejects.toThrow(NotFoundException);
  });
});
