import { Command } from '@adonisjs/ace';
import { createConnection } from 'typeorm';
import { ConfigService } from '@commands/service';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';

class BaseService extends Command {
  async connectMysql() {
    let config = new ConfigService();
    return await createConnection({
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
  }
  // let connection: Connection = await createConnection({
  //   type: 'mysql',
  //   name: 'commond',
  //   host: '127.0.0.1',
  //   port: 3306,
  //   username: 'root',
  //   password: 'abc123456',
  //   database: 'nest',
  //   entities: ['dist/src/**/**.entity{.ts,.js}'],
  //   synchronize: true,
  // });

  async getConnection() {
    try {
      return await this.connectMysql();
    } catch (error) {
      console.log(error.message); //TODO: 没有log
    }
  }
}

export default BaseService;
