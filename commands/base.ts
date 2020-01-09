import * as _ from 'lodash';
import * as moment from 'moment';
import { Alert, Logger } from '@commands/feature';
import { Command } from '@adonisjs/ace';
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
}

export default Base;
