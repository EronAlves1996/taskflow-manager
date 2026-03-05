import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntroduceUniqueConstraintOnAppUserTable1772739978484 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table app_user add constraint unique_name UNIQUE(name)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`alter table app_user drop constraint unique_name`);
  }
}
