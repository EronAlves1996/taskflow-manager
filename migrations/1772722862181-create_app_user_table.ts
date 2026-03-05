import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppUserTable1772722862181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE public.app_user (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
)`);

    await queryRunner.query(`
ALTER TABLE public.app_user OWNER TO postgres
`);
    await queryRunner.query(`
CREATE SEQUENCE public.app_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
`);
    await queryRunner.query(`
ALTER SEQUENCE public.app_user_id_seq OWNER TO postgres
`);

    await queryRunner.query(`
ALTER SEQUENCE public.app_user_id_seq OWNED BY public.app_user.id
`);
    await queryRunner.query(`
ALTER TABLE ONLY public.app_user ALTER COLUMN id SET DEFAULT nextval('public.app_user_id_seq'::regclass)
`);
    await queryRunner.query(`
ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (id)
`);
    await queryRunner.query(`
SELECT pg_catalog.setval('public.app_user_id_seq', 1, false)
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
drop table app_user cascade
`);
  }
}
