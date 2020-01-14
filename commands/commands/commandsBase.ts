import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Command } from '@adonisjs/ace';
import { Inject, Singleton } from 'typescript-ioc';
import { Alert, Logger } from '@commands/feature';
import { ConfigService } from '@commands/service';
import { DISPLAY_BY_MILLSECOND } from '@commands/config';
import { COMMAND_ARGUMENT_BY_MINUTE } from '../config/date_format';
import LKafka from '../feature/kafka';
const readLine = require('lei-stream').readLine;

abstract class CommandsBase extends Command {
  @Inject
  public logger: Logger;
  @Inject
  public alert: Alert;
  @Inject
  public config: ConfigService;
  constructor() {
    super();
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

  /**
   * 解析时间范围内的数据
   * @param startAtMoment
   * @param endAtMoment
   *
   */
  readLog = async (
    startAtMoment,
    endAtMoment,
    legalRecord,
    readLogSaveToCache,
  ) => {
    let startAt = startAtMoment.unix();
    let endAt = endAtMoment.unix();
    let self = this;
    for (
      let currentAt = startAt;
      currentAt <= endAt;
      currentAt = currentAt + 60
    ) {
      let currentAtMoment = moment.unix(currentAt);
      let absoluteLogUri = LKafka.getAbsoluteLogUriByType(
        currentAt,
        LKafka.LOG_TYPE_JSON,
      );
      self.log(
        `开始处理${currentAtMoment.format(
          COMMAND_ARGUMENT_BY_MINUTE,
        )}的记录, log文件地址 => ${absoluteLogUri}`,
      );
      if (fs.existsSync(absoluteLogUri) === false) {
        self.log(`log文件不存在, 自动跳过 => ${absoluteLogUri}`);
        continue;
      }
      // 按顺序读取日志文件
      await new Promise((resolve, reject) => {
        let onDataReceive = async (data, next) => {
          if (legalRecord.call(self, data)) {
            if (readLogSaveToCache.call(self, data)) {
              next();
            } else {
              next();
            }
          } else {
            self.log(`log 日志格式不正确=>` + data);
          }
        };
        let onReadFinish = () => {
          resolve();
        };
        readLine(fs.createReadStream(absoluteLogUri), {
          // 换行符，默认\n
          newline: '\n',
          // 是否自动读取下一行，默认false
          autoNext: false,
          // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
          encoding: function(data) {
            try {
              return JSON.parse(data);
            } catch (error) {
              self.log('解析文件错误' + error.message);
            }
          },
        }).go(onDataReceive, onReadFinish);
      });
      self.log('处理完毕');
    }
    this.log('全部数据处理完毕, 准备存入数据库中');
  };
}

export default CommandsBase;
