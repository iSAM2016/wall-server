/*  读取NGINX 文件
 * @Author: isam2016
 * @Date: 2020-01-15 14:16:32
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-15 16:54:53
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import CommandsBase from '../commandsBase';
import { CommonModuleInterface } from '@commands/interface';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_MONTH,
} from '@commands/config';
import { Inject } from 'typescript-ioc';

class NginxParse extends CommandsBase {
  constructor() {
    super();
  }
  static get signature() {
    return `
     SaveLog:Nginx
     `;
  }

  static get description() {
    return '每一分钟读取Nginx日志文件，并解析';
  }

  async handle(...arg) {
    // try {
    //   let that = this;
    //   // 获取项目列表
    //   let projectMap = await this.getProjectMap();
    //   let logCounter = 0;
    //   let legalLogCounter = 0;
    //   let nginxLogFilePath = commonConfig.nginxLogFilePath;
    //   let timeAt = moment().unix() - 60;
    //   let timeMoment = moment.unix(timeAt);
    //   let formatStr = timeMoment.format('/YYYYMM/DD/HH/mm');
    //   let logAbsolutePath = `${nginxLogFilePath}${formatStr}.log`;
    //   await this.readLog(
    //     this.startAtMoment,
    //     this.endAtMoment,
    //     this.isLegalRecord,
    //     this.readLogSaveToCache,
    //   );
    //   await this.saveTODB();
    // } catch (error) {
    //   this.alert.sendMessage(
    //     String(this.config.get('ALERT_WATCH_UCID_LIST')),
    //     error.stack,
    //   );
    //   this.log(this.constructor.name + '运行异常 =>' + error.stack);
    // }
  }
  /**
   * 获取项目列表
   */
  async getProjectMap() {}
}

export default ParseDevice;
