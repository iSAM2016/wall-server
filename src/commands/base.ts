import { Command } from '@adonisjs/ace';
import _ from 'lodash';
import { CommondInterface } from './interface';
import * as moment from 'moment';

import * as DATE_FORMAT from './utils/date_format';
console.log(DATE_FORMAT);
// import Logger from '~/src/library/logger';
// import Alert from '~/src/library/utils/modules/alert';
// import WatchIdList from '~/src/configs/alarm';

class Base extends Command {
  static get signature() {
    return `
     Parse:Base
     {--onlyFlag:[必传]flag,只有true/false两个值} 
     {--logName=@value:[必传]日志文件名} 
     {--isTest?=@value:[可选]是否处于测试环境}
     `;
  }

  static get description() {
    return '解析nginx日志, Base';
  }

  async handle(args, options) {
    this.log('command start');
    await this.execute(args, options).catch(e => {
      // Alert.sendMessage(WatchIdList.WATCH_UCID_LIST_DEFAULT, e.stack);
      this.log('catch error');
      this.log(e.stack);
    });
    this.log('command finish');
  }

  async execute(args, options) {}

  /**
   * 简易logger
   * @returns  null
   */
  async log(...arg) {
    let message = '';
    for (let rawMessage of arguments) {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    }
    let triggerAt = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND);
    // console.log(`[${triggerAt}]-[${this.constructor.name}] ` + message);
    // let logger = Logger.getLogger4Command(this.constructor.name);
    // logger.info(message);
  }

  /**
   * 简易logger
   * @returns  null
   */
  //   async warn() {
  //     let message = '';
  //     for (let rawMessage of arguments) {
  //       if (_.isString(rawMessage) === false) {
  //         message = message + JSON.stringify(rawMessage);
  //       } else {
  //         message = message + rawMessage;
  //       }
  //     }
  //     let triggerAt = moment().format(DATE_FORMAT.DISPLAY_BY_MILLSECOND);
  //     console.warn(`[${triggerAt}]-[${this.constructor.name}] ` + message);
  //     let logger = Logger.getLogger4Command(this.constructor.name);
  //     logger.warn(message);
  //   }
}

export default Base;
