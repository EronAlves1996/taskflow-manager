import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePriorityEnum1772478797309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
CREATE TYPE IF NOT EXISTS public.priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
)`,
    );

    await queryRunner.query('ALTER TYPE public.priority OWNER TO postgres');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE IF EXISTS public.priority');
  }
}
