import { Command } from '@adonisjs/ace';
import { ConfigService } from '@commands/service';
import { Connection, Repository, createConnection } from 'typeorm';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
interface ConnectionInterface<T> {
  connection: Connection;
  repository: Repository<T>;
}

let MYSQLCONNECTION = 'MYSQLCONNECTION';
let mysqlMap = new Map();

const mysqlConnection = async () => {
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
};

export const clearMysqlConnection = async () => {
  let connection = mysqlMap.get(MYSQLCONNECTION);
  await connection.close();
  mysqlMap.delete(MYSQLCONNECTION);
};

export const getMysqlConnection = async (): Promise<Connection> => {
  if (!mysqlMap.has(MYSQLCONNECTION)) {
    let connection = await mysqlConnection();
    mysqlMap.set(MYSQLCONNECTION, connection);
    return connection;
  }
  return mysqlMap.get(MYSQLCONNECTION);
};
