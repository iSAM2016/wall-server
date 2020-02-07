/* 用户第一次登陆
 * @Author: isam2016
 * @Date: 2020-01-14 14:06:22
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:39
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../parseBase';
import { Inject } from 'typescript-ioc';
import { EndParse, StartPase } from '../../../utils';
import { ParseInterface } from '../../../utils';
import { UserFirstLoginAtService } from './user_first_login_at.service';
import { COMMAND_ARGUMENT_BY_MINUTE } from '../../../config';

class UserFirstLoginAt extends ParseBase implements ParseInterface {
  constructor() {
    super();
  }
  // 统一按项目进行统计
  projectMap = new Map();
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  @Inject
  userFirstLoginAtService: UserFirstLoginAtService;
  static get signature() {
    return `
     Parse:UserFirstLoginAt 
     {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
  }

  static get description() {
    return '[按天] 解析nginx日志, 记录用户首次登陆时间';
  }

  /**
   * 判断该条记录是不是需要解析的记录
   * @param {Object} record
   * @return {Boolean}
   */
  // 1.开始自动获取日志
  @StartPase
  async handle(...arg) {
    try {
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
        error.message,
      );
      this.log(this.constructor.name + '运行异常 =>' + error.message);
    }
  }
  /**
   *  2.将日志存储到MAP 集合当中
   */
  readLogSaveToCache(record): boolean {
    let ucid = _.get(record, ['common', 'ucid'], '');
    let projectId = _.get(record, ['project_id'], '');
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let firstVisitAt = _.get(record, ['time'], 0);
    let dbRecordMap = new Map();
    let dbRecord = {
      ucid,
      project_id: projectId,
      country,
      province,
      city,
      first_visit_at: firstVisitAt,
    };
    if (this.projectMap.has(projectId)) {
      dbRecordMap = this.projectMap.get(projectId);
      if (dbRecordMap.has(ucid)) {
        let existRecord = dbRecordMap.get(ucid);
        if (existRecord['first_visit_at'] > dbRecord['first_visit_at']) {
          dbRecordMap.set(ucid, dbRecord);
        }
      } else {
        dbRecordMap.set(ucid, dbRecord);
      }
    }
    this.projectMap.set(projectId, dbRecordMap);
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
    for (let [projectId, dbRecordMap] of this.projectMap) {
      for (let [ucid, dbRecord] of dbRecordMap) {
        totalCount = totalCount + 1;
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
    try {
      let totalRecordCount = this.getRecordCountInProjectMap();
      let processRecordCount = 0;
      let successSaveCount = 0;
      for (let [projectId, dbRecordMap] of this.projectMap) {
        let ucidList = [];
        for (let ucid of dbRecordMap.keys()) {
          ucidList.push(ucid);
        }
        let existUcidSet = await this.userFirstLoginAtService.filterExistUcidSetInDb(
          projectId,
          ucidList,
        );
        for (let [ucid, dbRecord] of dbRecordMap) {
          let {
            project_id: projectId,
            country,
            province,
            city,
            first_visit_at: firstVisitAt,
          } = dbRecord;

          let isSuccess = false;
          ucid = `${ucid}`; // 专门转成string
          if (existUcidSet.has(ucid) === false) {
            let updateAt = moment().unix();
            // 只有ucid不存在的时候, 才需要插入
            let oldRecordList = await this.userFirstLoginAtService.getOldRecordList(
              projectId,
              ucid,
            );

            // 利用get方法, 不存在直接返回0, 没毛病
            let id = _.get(oldRecordList, [0, 'id'], 0);
            let oldFirstVisitAt = _.get(
              oldRecordList,
              [0, 'first_visit_at'],
              0,
            );
            let data = {
              ucid,
              first_visit_at: firstVisitAt,
              country,
              province,
              city,
              update_time: updateAt,
            };
            let isSuccess = false;
            if (id > 0) {
              if (oldFirstVisitAt > 0 && oldFirstVisitAt > firstVisitAt) {
                // 有更新的数据时更新一下
                let affectRows = await this.userFirstLoginAtService.updateUserFirstLoginAt(
                  id,
                  data,
                  projectId,
                );
                isSuccess = affectRows > 0;
              }
            } else {
              data['create_time'] = updateAt;
              let insertResult = await this.userFirstLoginAtService.insertUserFirstLoginAt(
                data,
                projectId,
              );
              let insertId = _.get(insertResult, [0], 0);
              isSuccess = insertId > 0;
            }
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
        }
      }
      return { totalRecordCount, processRecordCount, successSaveCount };
    } catch (error) {
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        error.message,
      );
      this.log(error.message);
    }
  }
}

export default UserFirstLoginAt;