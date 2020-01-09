import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Inject } from 'typescript-ioc';
import { ConfigService } from '@commands/service';

// export class Mysql {
//   @Inject
//   config: ConfigService;
//   constructor() {}
//   async connectMysql() {
//     return await createConnection({
//       type: 'mysql',
//       host: String(this.config.get('MYSQL_HOST')),
//       port: Number(this.config.get('MYSQL_PORT')),
//       username: String(this.config.get('MYSQL_USERNAME')),
//       password: String(this.config.get('MYSQL_PASSWORD')),
//       database: String(this.config.get('MYSQL_DATABASE')),
//       entities: ['dist/src/**/**.entity{.ts,.js}'],
//       synchronize: Boolean(this.config.get('MYSQL_SYNCHRONIZE')),
//     });
//   }

//   async getConnection() {
//     return await this.connectMysql();
//   }
// }

export const getConnection = async () => {
  return await createConnection({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'abc123456',
    database: 'nest',
    synchronize: true,
    logging: false,
    entities: ['dist/src/**/*.entity{.ts,.js}'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  });
};
