# Taskflow Manager

Simple task manager for team and work management.

## Highlights

- You can create bunch of tasks with many priorities and many statuses.

## Overview

In fact, this is a learning project, focusing mostly typescript, but in the way to learn Nest.js and the nest way of doing things, using classes, typeorm, class validator and so on.

This project is very java and class based OOP friendly, so any java developer can rapidly spot this project and figure out it's organization and features.

### Some important folders

1. migrations: This folder have all the migrations scripts required to the server to work
2. requests: This folder have all the curl scripts to make interactions with the server. No postman bullshit ;)
3. scripts: This folder have important scripts to interact with database and make some maintenance tasks easier

### Modules

- Actually, the project have only the task module, that handles everything about task.

## Usage Instructions

1. Setup database

```sh
docker compose up -d
```

2. Configure your environment configs

```sh
cp .env.example .env
vi .env
```

you should edit your env file with your database configurations, hostname, username and much more. The default values the project can work with the default values on the example file

3. To populate the database, you have two options:
   a. Take the scripts on migration and run them on the actual database. Actually, they are not automated.
   b. Open app.module.ts and configure the datasource to `synchronize: true`. Make sure after running the server after the first time, you revert this configuration. NEVER USE THIS IN PRODUCTION.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    TaskModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Task],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

4. Run the server

```sh
nest start
```

## To-Do

- Automate migration scripts
