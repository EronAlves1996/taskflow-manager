import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationUserTask1772741629806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
alter table task add assignee_id integer
`);
    await queryRunner.query(
      `alter table task add constraint fk_assignee_user foreign key (assignee_id) references app_user(id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
alter table task drop constraint fk_assignee_user
`);
    await queryRunner.query(`
alter table task drop column assignee_id
`);
  }
}
