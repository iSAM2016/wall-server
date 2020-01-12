import { Command } from '@adonisjs/ace';
import { ConfigService } from '@commands/service';
import { Connection, Repository, createConnection } from 'typeorm';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
interface ConnectionInterface<T> {
  connection: Connection;
  repository: Repository<T>;
}
class BaseService {
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
  async getRepository(entity) {
    try {
      let connection: Connection = await this.connectMysql();
      return { connection, repository: connection.getRepository(entity) };
    } catch (error) {
      console.log(error.message); //TODO: 没有log
    }
  }
}

export default BaseService;
