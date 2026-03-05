/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { UserService } from './user.service';

describe('UserModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {};
        }
      })
      .compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('it should reject users with less than 5 characters', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'José' })
      .expect(400)
      .expect((response) => {
        expect(response.body).toBeDefined();
        const body = response.body;
        expect(body?.message).toBeDefined();
        const message = body.message;
        expect(message).toHaveLength(1);
        expect(message[0]).toBe(
          'name must be longer than or equal to 5 characters',
        );
      });
  });

  it('it should reject users with less than 5 characters', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'José alskfhalsfhakfhkalshfkahjfhalfjalsfhlahflahjlkfhfashfjahslfahsflkajslfkashflkashfljaflasskljflsfhjashfjashfsh',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body).toBeDefined();
        const body = response.body;
        expect(body?.message).toBeDefined();
        const message = body.message;
        expect(message).toHaveLength(1);
        expect(message[0]).toBe(
          'name must be shorter than or equal to 50 characters',
        );
      });
  });
});
