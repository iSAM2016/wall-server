/* 解析uv
 * @Author: isam2016
 * @Date: 2020-01-06 16:37:01
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 14:30:12
 */
import * as moment from 'moment';
import { COMMAND_ARGUMENT_BY_MINUTE } from '../../config/date_format';
/**
 * @param {*} args
 * @param {*} options
 * @return {Boolean}
 */
export const StartPase = (
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>,
) => {
  let oldmethod = descriptor.value;
  descriptor.value = function(...arg) {
    this.log(this.constructor.name + 'start');
    let { startAtYmdHi, endAtYmdHi } = arg[0];
    this.startAtMoment = moment(startAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);
    this.endAtMoment = moment(endAtYmdHi, COMMAND_ARGUMENT_BY_MINUTE);
    let isSuccess = true;
    if (
      moment.isMoment(this.startAtMoment) === false ||
      this.startAtMoment.isValid() === false
    ) {
      let message = `startAtYmdHi参数不正确 => ${startAtYmdHi}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      isSuccess = false;
    }
    if (
      moment.isMoment(this.endAtMoment) === false ||
      this.endAtMoment.isValid() === false
    ) {
      let message = `endAtYmdHi参数不正确 =>${endAtYmdHi}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      isSuccess = false;
    }
    if (this.startAtMoment.unix() > this.endAtMoment.unix()) {
      let message = `结束时间小于开始时间 :  ${startAtYmdHi} => ${this.startAtMoment.unix()} endAtYmdHi =>  ${this.endAtMoment.unix()}`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      isSuccess = false;
    }
    if (!isSuccess) {
      let message = `${this.constructor.name}参数不正确, 自动退出`;
      this.warn(message);
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        message,
      );
      this.log(this.constructor.name + 'Parse:UV  finish');
      return false;
    }
    this.log(
      `开始分析${this.startAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':00'}~${this.endAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':59'}范围内的记录`,
    );

    oldmethod.apply(this, arg);
  };
};

export const EndParse = function(target, propetyKey, descriptor) {
  let oldMethod = descriptor.value;

  descriptor.value = async function(...arg) {
    let {
      totalRecordCount,
      processRecordCount,
      successSaveCount,
    } = await oldMethod.apply(this, arguments);
    this.log(
      `${this.startAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':00'}~${this.endAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':59'}范围内日志录入完毕, 共记录数据${processRecordCount}/${totalRecordCount}条, 入库成功${successSaveCount}条`,
    );
    this.log('数据库正常关闭');
    this.log(this.constructor.name + 'Parse:UV  finish');
  };
};
