/* 解析UV
 * @Author: isam2016
 * @Date: 2020-01-06 16:06:34
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-07 12:44:37
 * 独立访问用户数：即UniqueVisitor，访问网站的一台电脑客户端为一个访客。
 * 00:00-24:00内相同的客户端只被计算一次。
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import Base from '../../base';
import { CommonModuleInterface } from '@commands/interface';
import { Catcherror, ParseLog } from '@annotation';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_MINUTE,
} from '@commands/config';
import { Inject } from 'typescript-ioc';
import { UVService } from '@commands/service';

class ParseUV extends Base implements CommonModuleInterface {
  // 统一按项目进行统计
  projectMap = new Map();
  @Inject uvService: UVService;

  static get signature() {
    return `
     Parse:UV 
     {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
  }

  static get description() {
    return '[按小时] 解析kafka日志, 分析记录指定时间范围内的uv';
  }

  @Catcherror()
  @ParseLog() // 1.开始自动获取日志
  async handle() {
    try {
      /**
       * 3.将map数据同步到数据库中
       */
      let totalRecordCount = this.getRecordCountInProjectMap(); // 日志总数
      let processRecordCount = 0;
      let successSaveCount = 0; // 成功的条数
      console.log(this.projectMap);
      this.projectMap.forEach((visitAtMap, projectId) => {
        visitAtMap.forEach(async (uvMap, visitAtHour) => {
          let visitAtInDb = moment(visitAtHour, DATABASE_BY_MINUTE).unix();
          // console.log(projectId);
          // console.log(visitAtInDb);
          let existUuidSet = await this.uvService.getExistUuidSetInHour(
            projectId,
            visitAtInDb,
          );
          uvMap.forEach(async (uvRecord, uv) => {
            let {
              projectId,
              visitAt,
              uuid,
              country,
              province,
              city,
              pvCount,
            } = uvRecord;
            let isSuccess = false;
            uuid = `${uuid}`; // 转成string
            if (existUuidSet.has(uuid) === false) {
              // 只有当uuid不存在时才插入
              isSuccess = await this.uvService.replaceUvRecord(
                //TODO:
                projectId,
                uuid,
                visitAt,
                country,
                province,
                city,
              );
              // 插入完成后, 把uuid再补进去(意义不大, 只为了增强稳定性)
              existUuidSet.add(uuid);
            }
            processRecordCount = processRecordCount + 1;
            if (isSuccess) {
              successSaveCount = successSaveCount + 1;
            }
            this.reportProcess(
              processRecordCount,
              successSaveCount,
              totalRecordCount,
            );
          });
        });
      });
      return { totalRecordCount, processRecordCount, successSaveCount };
    } catch (error) {
      let message = this.constructor.name + '数据处理错误' + error.message;
      this.log(message);
    }
  }
  /**
   * 2. 将日志存储到MAP 集合当中
   */
  readLogSaveToCache(record): boolean {
    let commonInfo = _.get(record, ['common'], {});
    let uuid = _.get(commonInfo, ['uuid'], '');
    let visitAt = _.get(record, ['time'], 0);
    let projectId = _.get(record, ['project_id'], 0);
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let pvCount = 1;
    if (_.isNumber(visitAt) === false || visitAt === 0 || _.isEmpty({ uuid })) {
      this.log(`数据不合法, 自动跳过 visitAt => ${visitAt}, uuid => ${uuid}`);
      return false;
    }
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_MINUTE);
    let uvRecord = {
      projectId,
      visitAt,
      uuid,
      country,
      province,
      city,
      pvCount,
    };
    let visitAtMap = new Map();
    let uvMap = new Map();
    if (this.projectMap.has(projectId)) {
      visitAtMap = this.projectMap.get(projectId);
      if (visitAtMap.has(visitAtHour)) {
        uvMap = visitAtMap.get(visitAtHour);
        if (uvMap.has(uuid)) {
          let oldUvRecord = uvMap.get(uuid);
          uvRecord.pvCount = oldUvRecord.pvCount + uvRecord.pvCount;
        }
      }
    }
    uvMap.set(uuid, uvRecord);
    visitAtMap.set(visitAtHour, uvMap);
    this.projectMap.set(projectId, visitAtMap);
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
   * 汇报进度
   * @param {*} processRecordCount
   * @param {*} successSaveCount
   * @param {*} totalRecordCount
   */
  /**
   * 判断该条记录是不是uv记录 格式
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(record) {
    return true;
  }
}

export default ParseUV;
