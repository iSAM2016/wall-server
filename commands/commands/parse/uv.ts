/* 解析UV
 * @Author: isam2016
 * @Date: 2020-01-06 16:06:34
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-07 12:44:37
 * 独立访问用户数：即UniqueVisitor，访问网站的一台电脑客户端为一个访客。
 * 00:00-24:00内相同的客户端只被计算一次。
 */

import _ from 'lodash';
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
  @Inject UVservice: UVService;
  // 统一按项目进行统计
  projectMap = new Map();
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
  @ParseLog()
  async handle() {
    /**
     * 将数据同步到数据库中
     */
    let totalRecordCount = this.getRecordCountInProjectMap(); // 日志总数
    let processRecordCount = 0;
    let successSaveCount = 0; // 成功的条数
    this.UVservice.getExistUuidSetInHour();
    // this.projectMap.forEach(({ projectId, visitAtMap }) => {
    //   visitAtMap.forEach(async ({ visitAtHour, uvMap }) => {
    //     let visitAtInDb = moment(visitAtHour, DATABASE_BY_MINUTE).unix();
    //     let existUuidSet = await MUvRecord.getExistUuidSetInHour(
    //       projectId,
    //       visitAtInDb,
    //     );

    //     for (let [uv, uvRecord] of uvMap) {
    //       let {
    //         projectId,
    //         visitAt,
    //         uuid,
    //         country,
    //         province,
    //         city,
    //         pvCount,
    //       } = uvRecord;
    //       let isSuccess = false;
    //       uuid = `${uuid}`; // 转成string
    //       if (existUuidSet.has(uuid) === false) {
    //         // 只有当uuid不存在时才插入
    //         isSuccess = await MUvRecord.replaceUvRecord(
    //           projectId,
    //           uuid,
    //           visitAt,
    //           country,
    //           province,
    //           city,
    //         );
    //         // 插入完成后, 把uuid再补进去(意义不大, 只为了增强稳定性)
    //         existUuidSet.add(uuid);
    //       }
    //       processRecordCount = processRecordCount + 1;
    //       if (isSuccess) {
    //         successSaveCount = successSaveCount + 1;
    //       }
    //       this.reportProcess(
    //         processRecordCount,
    //         successSaveCount,
    //         totalRecordCount,
    //       );
    //     }
    //   });
    // });
    return { totalRecordCount, processRecordCount, successSaveCount };
  }
  /**
   * 判断该条记录是不是uv记录
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(record) {
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
}

export default ParseUV;
