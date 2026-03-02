import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskStatusEnum1772478941806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TYPE IF NOT EXISTS public.task_status AS ENUM (
    'pending',
    'in-progress',
    'completed'
)`);
    await queryRunner.query('ALTER TYPE public.task_status OWNER TO postgres');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE IF EXISTS public.task_status');
  }
}
