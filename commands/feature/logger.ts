import * as log4js from 'log4js';
import * as moment from 'moment';
import { DISPLAY_BY_MILLSECOND } from '../config/date_format';
import _ from 'lodash';
var path = require('path');
let ABSOLUTE_LOG_PATH = path.resolve(__dirname, '../../../', 'log');

export class Logger {
  /**
   * getLogger会重新打开一个文件, 导致文件句柄打开过多, 系统报错退出, 因此需要人工做一层缓存
   */
  private loggerCacheMap = new Map();
  private baseLoggerConfig: log4js.Configuration;
  constructor(private options) {
    // let config: ConfigOptions;
    // const filePath: string = `${process.env.NODE_ENV || 'development'}.env`;
    // const envFile: string = resolve(
    //   __dirname,
    //   '../../',
    //   options.folder,
    //   filePath,
    // );
    // if (this.isFileExist(envFile)) {
    //   config = dotenv.parse(fs.readFileSync(envFile));
    // }
    // ConfigService.envConfig = this.validateInpt(config);
    this.baseLoggerConfig = {
      appenders: {
        // command: {
        //   type: 'dateFile',
        //   filename: `${config. ABSOLUTE_LOG_PATH}/command/${commandName}`,
        //   pattern: '-yyyy-MM-dd.log',
        //   alwaysIncludePattern: true
        // },
        express: {
          type: 'dateFile',
          filename: `${ABSOLUTE_LOG_PATH}/express/runtime`,
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
        },
      },
      categories: {
        default: { appenders: ['express'], level: 'info' },
        // command: { appenders: ['command'], level: 'info' },
        express: { appenders: ['express'], level: 'info' },
      },
    };
  }
  // 获取logger 实例
  getLogger = (
    loggerType: string = 'express',
    loggerConfig: log4js.Configuration,
  ): log4js.Logger => {
    let loggerConfigJSON = JSON.stringify({ loggerType, loggerConfig });

    if (this.loggerCacheMap.has(loggerConfigJSON)) {
      return this.loggerCacheMap.get(loggerConfigJSON);
    } else {
      log4js.configure(loggerConfig);
      let logger = log4js.getLogger(loggerType);
      this.loggerCacheMap.set(loggerConfigJSON, logger);
      return logger;
    }
  };
  getExpressLogger(): log4js.Logger {
    return this.getLogger('express', this.baseLoggerConfig);
  }
  /**
   * 简易logger info
   */
  info = (...arg): void => {
    let message: string = '';
    arg.forEach(rawMessage => {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    });
    let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
    console.log(`[${triggerAt}]-[runtime] ` + message);
    this.getExpressLogger().info(message);
  };
  /**
   * 简易logger- wall
   */
  warn = (...arg): void => {
    let message: string = '';
    arg.forEach(rawMessage => {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    });

    let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
    console.warn(
      `[${triggerAt}]-[runtime] ` +
        message +
        ` => ${this.getStackInfoString()}`,
    );
    this.getExpressLogger().warn(message + ` => ${this.getStackInfoString()}`);
  };
  /**
   * 简易logger  error
   */
  error = (...arg): void => {
    let message = '';
    arg.forEach(rawMessage => {
      if (_.isString(rawMessage) === false) {
        message = message + JSON.stringify(rawMessage);
      } else {
        message = message + rawMessage;
      }
    });
    let triggerAt = moment().format(DISPLAY_BY_MILLSECOND);
    console.error(
      `[${triggerAt}]-[runtime] ` +
        message +
        ` => ${this.getStackInfoString()}`,
    );
    this.getExpressLogger().error(message + ` => ${this.getStackInfoString()}`);
  };
  /**
   * 为Commande类提供Logger
   * @param {*} commandName
   */
  getLogger4Command = (commandName = 'unsetCommandName') => {
    let loggerConfig: log4js.Configuration = {
      appenders: {
        command: {
          type: 'dateFile',
          filename: `${ABSOLUTE_LOG_PATH}/command/${commandName}`,
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
        },
        express: {
          type: 'dateFile',
          filename: `${ABSOLUTE_LOG_PATH}/express/runtime`,
          pattern: '-yyyy-MM-dd.log',
          alwaysIncludePattern: true,
        },
      },
      categories: {
        default: { appenders: ['express'], level: 'info' },
        command: { appenders: ['command'], level: 'info' },
        express: { appenders: ['express'], level: 'info' },
      },
    };

    return this.getLogger(`command`, loggerConfig);
  };
  /**
   * 追踪日志输出文件名,方法名,行号等信息
   * @returns Object
   */
  getStackInfoString = (): string => {
    let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    let stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
    let stacklist = new Error().stack.split('\n').slice(3);
    let s = stacklist[0];
    let sp = stackReg.exec(s) || stackReg2.exec(s);
    let data: any = {};
    if (sp && sp.length === 5) {
      data.method = sp[1];
      data.path = sp[2];
      data.line = sp[3];
      data.pos = sp[4];
      data.file = path.basename(data.path);
    }
    return JSON.stringify(data);
  };
}
