import { Connection, Repository, createConnection } from 'typeorm';
interface ConnectionInterface<T> {
  connection: Connection;
  repository: Repository<T>;
}
import { ConfigService } from '@commands/service';
import { getMysqlConnection } from './base';
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
      extra: {
        connectionLimit: 1, // 连接池最大连接数量, 查阅资料 建议是  core number  * 2 + n
      },
      cache: false,
    });
  }
}

export default BaseService;
