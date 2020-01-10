import * as _ from 'lodash';
import * as moment from 'moment';
import { Command } from '@adonisjs/ace';
import { createConnection } from 'typeorm';
import { Alert, Logger } from '@commands/feature';
import { ConfigService } from '@commands/service';
import { CommonModuleInterface } from './interface';
import { DISPLAY_BY_MILLSECOND } from '@commands/config';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
class Base extends Command {
  @Inject
  public logger: Logger;
  @Inject
  public alert: Alert;
  @Inject
  public config: ConfigService;

  // /**
  //  * logger-log
  //  */
  async log(...arg) {
    let message = '';
    arg.forEach(rawMessage => {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    });
    let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
    console.log(`[${triggerAt}]-[${this.constructor.name}] ` + message);
    this.logger.getLogger4Command(this.constructor.name).info(message);
  }
  // /**
  //  *  commond-logger
  //  * @returns  null
  //  */
  async warn(...arg) {
    let message = '';
    arg.forEach(rawMessage => {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    });
    let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
    console.warn(`[${triggerAt}]-[${this.constructor.name}] ` + message);
    this.logger.getLogger4Command(this.constructor.name).warn(message);
  }
  // 汇报进度
  reportProcess(
    processRecordCount,
    successSaveCount,
    totalRecordCount,
    tableName = '',
  ) {
    let insertTable = '';
    if (tableName) {
      insertTable = `, 入库${tableName}`;
    }
    if (processRecordCount % 100 === 0) {
      this.log(
        `当前已处理${processRecordCount}/${totalRecordCount}条记录${insertTable}, 已成功${successSaveCount}条`,
      );
    }
  }

  async connectMysql() {
    return await createConnection({
      type: 'mysql',
      host: String(this.config.get('MYSQL_HOST')),
      port: Number(this.config.get('MYSQL_PORT')),
      username: String(this.config.get('MYSQL_USERNAME')),
      password: String(this.config.get('MYSQL_PASSWORD')),
      database: String(this.config.get('MYSQL_DATABASE')),
      entities: ['dist/src/**/**.entity{.ts,.js}'],
      synchronize: Boolean(this.config.get('MYSQL_SYNCHRONIZE')),
    });
  }

  async getConnection() {
    return await this.connectMysql();
  }
}

export default Base;
