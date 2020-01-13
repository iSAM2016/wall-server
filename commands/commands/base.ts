import * as fs from 'fs';
import * as _ from 'lodash';
import { Inject, Singleton } from 'typescript-ioc';
import { ConfigService } from '@commands/service';
import { Connection, Repository, createConnection } from 'typeorm';

@Singleton
abstract class Base {
  constructor() {
    this.connectMysql();
  }
  public conection;
  async connectMysql() {
    let config = new ConfigService();
    let conection = await createConnection({
      type: 'mysql',
      name: 'commond',
      host: String(config.get('MYSQL_HOST')),
      port: Number(config.get('MYSQL_PORT')),
      username: String(config.get('MYSQL_USERNAME')),
      password: String(config.get('MYSQL_PASSWORD')),
      database: String(config.get('MYSQL_DATABASE')),
      entities: ['dist/src/**/**.entity{.ts,.js}'],
      synchronize: Boolean(config.get('MYSQL_SYNCHRONIZE')),
    });
    this.conection = conection;
  }
}

export default Base;
