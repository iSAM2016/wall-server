import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DISPLAY_BY_MILLSECOND } from '../config/date_format';
import { Alert, Logger } from '@commands/core';
import { Inject } from 'typescript-ioc';

class BaseService {
  @Inject
  public loggers: Logger;
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
    this.loggers.getLogger4Command(this.constructor.name).info(message);
  }
}

export default BaseService;
