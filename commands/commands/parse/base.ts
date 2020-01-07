/* 解析uv
 * @Author: isam2016
 * @Date: 2020-01-06 16:37:01
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-07 12:45:51
 */
import * as fs from 'fs';
import * as moment from 'moment';
import Base from '../../base';
const readLine = require('lei-stream').readLine;

// import Alert from '~/src/library/utils/modules/alert';
// import AlarmConfig from '~/src/configs/alarm';

import { COMMAND_ARGUMENT_BY_MINUTE } from '../../config/date_format';
import LKafka from '../../feature/kafka';
import { Inject } from 'typescript-ioc';
import { ParseBaseInterface } from '../../../commands/interface';

export default class ParseBase extends Base implements ParseBaseInterface {
  private projectMap = new Map();
  private startAtMoment = null;
  private endAtMoment = null;
  // DATE_FORMAT_ARGUMENTS = DATE_FORMAT.COMMAND_ARGUMENT_BY_MINUTE;
  //   DATE_FORMAT_DISPLAY = DATE_FORMAT.COMMAND_ARGUMENT_BY_MINUTE;

  constructor() {
    super();
  }

  async execute(argss, options) {
    // let { startAtYmdHi, endAtYmdHi } = args;

    let args = {
      startAtYmdHi: new Date(2011, 2, 12, 5, 0, 0),
      endAtYmdHi: new Date(2011, 2, 12, 6, 0, 0),
    };
    let startAtYmdHi = new Date(2011, 2, 12, 5, 0, 0);
    let endAtYmdHi = new Date(2012, 2, 12, 5, 0, 0);
    if (this.isArgumentsLegal(args) === false) {
      this.warn('参数不正确, 自动退出');
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        `${this.constructor.name}参数不正确, 自动退出`,
      );
      return false;
    }
    this.startAtMoment = moment(startAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);
    this.endAtMoment = moment(endAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);
    this.log(
      `开始分析${this.startAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':00'}~${this.endAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':59'}范围内的记录`,
    );
    let startAt = this.startAtMoment.unix();
    let endAt = this.endAtMoment.unix();
    await this.parseLog(startAt, endAt);
    this.log('全部数据处理完毕, 存入数据库中');
    // let {
    //   totalRecordCount,
    //   processRecordCount,
    //   successSaveCount,
    // } = await this.saveToDB();

    // this.log(
    //   `${this.startAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
    //     ':00'}~${this.endAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
    //     ':59'}范围内日志录入完毕, 共记录数据${processRecordCount}/${totalRecordCount}条, 入库成功${successSaveCount}条`,
    // );
  }
  /**
   * @param {*} args
   * @param {*} options
   * @return {Boolean}
   */
  isArgumentsLegal(args) {
    var m = moment(new Date(2011, 2, 12, 5, 0, 0), COMMAND_ARGUMENT_BY_MINUTE);
    console.log(m.isValid()); // false
    m.invalidAt(); // 5 for seconds
    let { startAtYmdHi, endAtYmdHi } = args;
    let startAtMoment = moment(startAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);
    let endAtMoment = moment(endAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);

    if (
      moment.isMoment(startAtMoment) === false ||
      startAtMoment.isValid() === false
    ) {
      let message = `startAtYmdHi参数不正确 => ${startAtYmdHi}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      return false;
    }
    if (
      moment.isMoment(endAtMoment) === false ||
      endAtMoment.isValid() === false
    ) {
      let message = `endAtYmdHi参数不正确 =>${endAtYmdHi}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      return false;
    }
    if (startAtMoment.unix() > endAtMoment.unix()) {
      let message = `结束时间小于开始时间 :  ${startAtYmdHi} => ${startAtMoment.unix()} endAtYmdHi =>  ${endAtMoment.unix()}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      return false;
    }
    return true;
  }
  /**
   * 解析时间范围内的数据
   * @param startAt
   * @param endAt
   */
  async parseLog(startAt, endAt) {
    let that = this;
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
      this.log(
        `开始处理${currentAtMoment.format(
          COMMAND_ARGUMENT_BY_MINUTE,
        )}的记录, log文件地址 => ${absoluteLogUri}`,
      );
      console.log(absoluteLogUri);
      if (fs.existsSync(absoluteLogUri) === false) {
        that.log(`log文件不存在, 自动跳过 => ${absoluteLogUri}`);
        continue;
      }
      // 按顺序读取日志文件
      await new Promise((resolve, reject) => {
        let onDataReceive = async (data, next) => {
          try {
            let record = JSON.parse(data); // 其他操作
            next();
          } catch (error) {
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
            return JSON.parse(data);
          },
        }).go(onDataReceive, onReadFinish);
      });
      that.log('处理完毕');
    }
  }
}
