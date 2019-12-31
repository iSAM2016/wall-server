import * as _ from 'lodash';
import * as moment from 'moment';
import Logger from './feature/logger';
import { Command } from '@adonisjs/ace';
import { CommondInterface } from './interface';
import { DISPLAY_BY_MILLSECOND } from './config/date_format';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
// import Alert from './feature/alert';
// import WatchIdList from '~/src/configs/alarm';

class Base extends Command {
  @Inject
  private logger: Logger;

  static get signature(): string {
    return `
     Parse:Base
     {--onlyFlag:[必传]flag,只有true/false两个值}
     {--logName=@value:[必传]日志文件名}
     {--isTest?=@value:[可选]是否处于测试环境}
     `;
  }
  static get description(): string {
    return '解析nginx日志, Base';
  }

  // async execute(args, options) {}
  /**
   * logger-log
   */
  async log(...arg) {
    console.log(arg);
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
  /**
   *  commond-logger
   * @returns  null
   */
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
}

export default Base;
