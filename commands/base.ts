import * as _ from 'lodash';
import * as moment from 'moment';
import Alert from './feature/alert';
import Logger from './feature/logger';
import { Command } from '@adonisjs/ace';
import { DISPLAY_BY_MILLSECOND } from './config/date_format';
import { AutoWired, Inject, Singleton, Provides } from 'typescript-ioc';
import ConfigService from './utils/configLoad';

class Base extends Command {
  @Inject
  private logger: Logger;
  @Inject
  private alert: Alert;
  @Inject
  private config: ConfigService;

  async handle(args, options) {
    await this.execute(args, options).catch(e => {
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        e.stack,
      );
      this.log('catch error');
      this.log(e.stack);
    });
  }

  async execute(args, options) {}
  /**
   * logger-log
   */
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
