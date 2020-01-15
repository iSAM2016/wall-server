/* 解析设备
 * @Author: isam2016
 * @Date: 2020-01-14 10:30:17
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-15 15:31:14
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import CommandsBase from '../commandsBase';
import { EndParse, StartPase } from 'commands/utils/annotation';
import { CommonModuleInterface } from 'commands/utils/interface';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_MONTH,
} from '@commands/config';
import { Inject } from 'typescript-ioc';
import { DataCleaning } from '@commands/core';

class ParseDevice extends CommandsBase implements CommonModuleInterface {
  constructor() {
    super();
  }
  // 统一按项目进行统计
  projectMap = new Map();
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  @Inject
  dataCleaning: DataCleaning;
  static get signature() {
    return `
      Parse:Device
      {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
      {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
    `;
  }

  static get description() {
    return '[按天] 解析kafka日志, 分析指定时间范围Device';
  }

  // 1.开始自动获取日志
  @StartPase
  async handle(...arg) {
    try {
      console.log(arg);
      await this.readLog(
        this.startAtMoment,
        this.endAtMoment,
        this.isLegalRecord,
        this.readLogSaveToCache,
      );
      await this.saveTODB();
    } catch (error) {
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        error.stack,
      );
      this.log(this.constructor.name + '运行异常 =>' + error.stack);
    }
  }
  /**
   *  2.将日志存储到MAP 集合当中
   */
  readLogSaveToCache(record): boolean {
    let commonInfo = _.get(record, ['common'], {});
    let ua = _.get(record, ['ua'], {});
    let uuid = _.get(commonInfo, ['uuid'], '');
    let visitAt = _.get(record, ['time'], 0);
    let projectId = _.get(record, ['project_id'], 0);
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let browser = _.get(ua, ['browser', 'name'], '');
    let browserVersion = _.get(ua, ['browser', 'version'], '');
    let engine = _.get(ua, ['engine', 'name'], '');
    let engineVersion = _.get(ua, ['engine', 'version'], '');
    let deviceVendor = _.get(ua, ['device', 'vendor'], '');
    let deviceModel = _.get(ua, ['device', 'model'], '');
    let os = _.get(ua, ['os', 'name'], '');
    let osVersion = _.get(ua, ['os', 'version'], '');
    let runtimeVersion = _.get(commonInfo, ['runtime_version'], '');
    let visitAtMonth = moment.unix(visitAt).format(DATABASE_BY_MONTH);
    let deviceRecord = {
      projectId,
      visitAt,
      uuid,
      browser,
      browserVersion,
      engine,
      engineVersion,
      deviceVendor,
      deviceModel,
      os,
      osVersion,
      country,
      province,
      city,
      runtimeVersion,
    };

    // 数据清洗迭代器
    if (!this.dataCleaning.getData(deviceRecord, 'deviceConfigDevice')) {
      return false;
    }

    let visitAtMap = new Map();
    let deviceMap = new Map();
    if (this.projectMap.has(projectId)) {
      visitAtMap = this.projectMap.get(projectId);
      if (visitAtMap.has(visitAtMonth)) {
        deviceMap = visitAtMap.get(visitAtMonth);
      }
    }
    deviceMap.set(uuid, deviceRecord);
    visitAtMap.set(visitAtMonth, deviceMap);
    this.projectMap.set(projectId, visitAtMap);
    return true;
  }
  /**
   * 判断该条记录是不是uv记录 格式
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(): boolean {
    return true;
  }
  /**
   * 统计 projectUvMap 中的记录总数
   */
  getRecordCountInProjectMap() {
    let totalCount = 0;
    for (let [projectId, visitAtMap] of this.projectMap) {
      for (let [visitAtHour, uvMap] of visitAtMap) {
        for (let [uv, uvRecord] of uvMap) {
          totalCount = totalCount + 1;
        }
      }
    }
    return totalCount;
  }
  /**
   *3.存储到数据库
   * @memberof ParseUV
   */
  @EndParse
  async saveTODB() {
    let totalRecordCount = this.getRecordCountInProjectMap();
    let processRecordCount = 0;
    let successSaveCount = 0;
    for (let [projectId, visitAtMap] of this.projectMap) {
      //   const processTableName = MCommon.getTableName(
      //     BaseTableName,
      //     MCommon.SPLIT_BY.PROJECT,
      //     projectId,
      //   );
      for (let [visitAtMonth, deviceMap] of visitAtMap) {
        for (let [uuid, deviceRecord] of deviceMap) {
          let { visitAt } = deviceRecord;
          const sqlParams = {
            uuid: uuid,
            browser: deviceRecord.browser,
            browser_version: deviceRecord.browserVersion,
            engine: deviceRecord.engine,
            engine_version: deviceRecord.engineVersion,
            device_vendor: deviceRecord.deviceVendor,
            device_model: deviceRecord.deviceModel,
            os: deviceRecord.os,
            os_version: deviceRecord.osVersion,
            country: deviceRecord.country,
            province: deviceRecord.province,
            city: deviceRecord.city,
            runtime_version: deviceRecord.runtimeVersion,
            visit_at_month: visitAtMonth,
            log_at: visitAt,
          };
          //   let isSuccess = await MCommon.replaceInto({
          //     tableName: BaseTableName,
          //     splitBy: MCommon.SPLIT_BY.PROJECT,
          //     projectId: projectId,
          //     where: { visit_at_month: visitAtMonth, uuid: uuid },
          //     datas: sqlParams,
          //   });
          let isSuccess = true;
          processRecordCount = processRecordCount + 1;
          if (isSuccess) {
            successSaveCount = successSaveCount + 1;
          }
          this.reportProcess(
            processRecordCount,
            successSaveCount,
            totalRecordCount,
            // processTableName,
          );
        }
      }
    }
    return { totalRecordCount, processRecordCount, successSaveCount };
  }
}

export default ParseDevice;
