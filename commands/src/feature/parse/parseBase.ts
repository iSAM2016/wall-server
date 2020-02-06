import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { COMMAND_ARGUMENT_BY_MINUTE } from '@app/config';
import { getAbsoluteLogUriByType, LOG_TYPE_JSON } from '@app/core';
import CommandsBase from '../commandsBase';
const readLine = require('lei-stream').readLine;
abstract class ParseBase extends CommandsBase {
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
      let absoluteLogUri = getAbsoluteLogUriByType(currentAt, LOG_TYPE_JSON);
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

export default ParseBase;
