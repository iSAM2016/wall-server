import { Command } from '@adonisjs/ace';
import { createConnection } from 'typeorm';
import { ConfigService } from '@commands/service';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';

class BaseService extends Command {
  async connectMysql() {
    let config = new ConfigService();
    return await createConnection({
      type: 'mysql',
      host: String(config.get('MYSQL_HOST')),
      port: Number(config.get('MYSQL_PORT')),
      username: String(config.get('MYSQL_USERNAME')),
      password: String(config.get('MYSQL_PASSWORD')),
      database: String(config.get('MYSQL_DATABASE')),
      entities: ['dist/src/**/**.entity{.ts,.js}'],
      synchronize: Boolean(config.get('MYSQL_SYNCHRONIZE')),
    });
  }

  async getConnection() {
    return await this.connectMysql();
  }
}

export default BaseService;
