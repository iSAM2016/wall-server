import { ConfigService } from '@commands/core';
import { Connection, Repository, createConnection } from 'typeorm';
import * as knex from 'knex';
interface ConnectionInterface<T> {
  connection: Connection;
  repository: Repository<T>;
}

let MYSQLCONNECTION = 'MYSQLCONNECTION';
let mysqlMap = new Map();

const mysqlConnection = () => {
  let config = new ConfigService();
  return knex({
    client: 'mysql',
    connection: {
      host: String(config.get('MYSQL_HOST')),
      port: Number(config.get('MYSQL_PORT')),
      user: String(config.get('MYSQL_USERNAME')),
      password: String(config.get('MYSQL_PASSWORD')),
      database: String(config.get('MYSQL_DATABASE')),
    },
    debug: false,
    pool: {
      max: 10,
      min: 0,
      // 由于存在资源池, 导致句柄不被释放, 程序不能退出
      // 因此将最小句柄数设为0, 每100ms检查一次是否有超过120ms未被使用的资源
      // 以便句柄的及时回收
      // free resouces are destroyed after this many milliseconds
      idleTimeoutMillis: 100,
      // how often to check for idle resources to destroy
      reapIntervalMillis: 150,
    },
    acquireConnectionTimeout: 60000,
    log: {
      error(message) {
        // Alert.sendMessage( // TODO: 数据库异常
        //   WatchIdList.WATCH_UCID_LIST_DEFAULT,
        //   `数据库操作异常 => ${message}`,
        // );
      },
    },
  });
};

export function InjectRepositorys() {
  return function(target, propertyKey) {
    // 修改属性
    Object.defineProperty(target, propertyKey, {
      enumerable: true,
      get: function() {
        return mysqlConnection();
      },
      set: function(value) {},
    });
  };
}
