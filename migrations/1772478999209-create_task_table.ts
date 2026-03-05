import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1772478999209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE public.task (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    status public.task_status NOT NULL,
    priority public.priority NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
)`);
    await queryRunner.query('ALTER TABLE public.task OWNER TO postgres');
    await queryRunner.query(`
CREATE SEQUENCE public.task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
`);
    await queryRunner.query(
      'ALTER SEQUENCE public.task_id_seq OWNER TO postgres',
    );
    await queryRunner.query(
      'ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id',
    );
    await queryRunner.query(
      "ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq':: regclass)",
    );
    await queryRunner.query(`
ALTER TABLE ONLY public.task
    ADD CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.task CASCADE');
  }
}
