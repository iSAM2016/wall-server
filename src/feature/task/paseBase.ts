import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@core';
import appConfig from '../../../config/app';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  getAbsoluteLogUriByType,
  LOG_TYPE_JSON,
} from '@utils';

const readLine = require('lei-stream').readLine;

class ParseBase {
  private readonly loggers = new Logger(this.constructor.name);

  //存入数据库汇报进度
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
      this.loggers.log(
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
    for (
      let currentAt = startAt;
      currentAt <= endAt;
      currentAt = currentAt + 60
    ) {
      let currentAtMoment = moment.unix(currentAt);
      let absoluteLogUri = '';
      if (ConfigService.isDevelopment) {
        absoluteLogUri = `${appConfig.absoluteLogPath}/nginx/json/month_202002/day_07/07/21.log`;
      } else {
        absoluteLogUri = getAbsoluteLogUriByType(currentAt, LOG_TYPE_JSON);
      }
      this.loggers.log(
        `开始处理${currentAtMoment.format(
          COMMAND_ARGUMENT_BY_MINUTE,
        )}的记录, log文件地址 => ${absoluteLogUri}`,
      );
      if (fs.existsSync(absoluteLogUri) === false) {
        this.loggers.log(`log文件不存在, 自动跳过 => ${absoluteLogUri}`);
        continue;
      }
      // 按顺序读取日志文件
      await new Promise((resolve, reject) => {
        let onDataReceive = async (data, next) => {
          if (legalRecord.call(this, data)) {
            if (readLogSaveToCache.call(this, data)) {
              next();
            } else {
              next();
            }
          } else {
            this.loggers.log(
              `log 日志格类型不符合筛选标准，自动跳过=>` + JSON.stringify(data),
            );
            next();
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
              this.loggers.log('解析文件错误' + error.message);
            }
          },
        }).go(onDataReceive, onReadFinish);
      });
      this.loggers.log('处理完毕');
    }
    this.loggers.log('全部数据处理完毕, 准备存入数据库中');
  };
}

export default ParseBase;
