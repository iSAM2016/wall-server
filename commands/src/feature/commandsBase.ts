import * as _ from 'lodash';
import * as moment from 'moment';
import { Command } from '@adonisjs/ace';
import { Inject, Singleton } from 'typescript-ioc';
import { Alert, Logger, ConfigService, getConfig } from '../core';
import { DISPLAY_BY_MILLSECOND } from '../config';

abstract class CommandsBase extends Command {
  @Inject
  public logger: Logger;
  @Inject
  public alert: Alert;
  public config: ConfigService;
  constructor() {
    super();
    this.config = getConfig();
  }
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
}

export default CommandsBase;
