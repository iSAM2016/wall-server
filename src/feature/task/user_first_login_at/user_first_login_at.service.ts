/* 用户第一次登陆
 * @Author: isam2016
 * @Date: 2020-01-14 14:06:22
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:39
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TRUserFirstLoginAt } from '@entity';
import { Injectable, Logger } from '@nestjs/common';
import { COMMAND_ARGUMENT_BY_MINUTE } from '@utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserFirstLoginAtService extends ParseBase {
  constructor(
    @InjectRepository(TRUserFirstLoginAt)
    private readonly userFirstLoginAtRepository: Repository<TRUserFirstLoginAt>,
  ) {
    super();
  }

  private readonly logger = new Logger(UserFirstLoginAtService.name);
  // 统一按项目进行统计
  private projectMap = new Map();
  private endAtMoment;
  private startAtMoment;

  // 每小时15分30秒启动
  @Cron('30 */15 * * * *')
  // @Cron('*/4 * * * * *')
  async handle() {
    let nowByMinute = moment();
    let lastDayStartAtByMinute = moment()
      .subtract(15, 'minute')
      .startOf('minute');
    this.startAtMoment = lastDayStartAtByMinute;
    this.endAtMoment = nowByMinute;
    this.logger.log(
      `开始分析${this.startAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':00'}~${this.endAtMoment.format(COMMAND_ARGUMENT_BY_MINUTE) +
        ':59'}范围内的记录`,
    );
    await this.readLog(
      this.startAtMoment,
      this.endAtMoment,
      this.isLegalRecord,
      this.readLogSaveToCache,
    );
    await this.saveTODB();
  }

  /**
   *  2.将日志存储到MAP 集合当中
   */
  readLogSaveToCache(record): boolean {
    let ucid = _.get(record, ['userId'], '');
    let projectId = _.get(record, ['project_id'], '');
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let firstVisitAt = _.get(record, ['time'], 0);
    let dbRecordMap = new Map();
    let dbRecord = {
      ucid,
      projectId,
      country,
      province,
      city,
      firstVisitAt,
    };
    if (this.projectMap.has(projectId)) {
      dbRecordMap = this.projectMap.get(projectId);
      if (dbRecordMap.has(ucid)) {
        let existRecord = dbRecordMap.get(ucid);
        if (existRecord['firstVisitAt'] > dbRecord['firstVisitAt']) {
          dbRecordMap.set(ucid, dbRecord);
        }
      }
    } else {
      dbRecordMap.set(ucid, dbRecord);
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
  async saveTODB() {
    let totalRecordCount = this.getRecordCountInProjectMap();
    let processRecordCount = 0;
    let successSaveCount = 0;
    for (let [projectId, dbRecordMap] of this.projectMap) {
      let ucidList = [];
      for (let ucid of dbRecordMap.keys()) {
        ucidList.push(ucid);
      }
      let existUcidSet = await this.filterExistUcidSetInDb(projectId, ucidList);
      for (let [ucid, dbRecord] of dbRecordMap) {
        let { projectId, country, province, city, firstVisitAt } = dbRecord;

        let isSuccess = false;
        ucid = `${ucid}`; // 专门转成string
        if (existUcidSet.has(ucid) === false) {
          let updateAt = moment().unix();
          // 只有ucid不存在的时候, 才需要插入
          let oldRecordList = await this.getOldRecordList(projectId, ucid);
          // 利用get方法, 不存在直接返回0, 没毛病
          let id = _.get(oldRecordList, [0, 'id'], 0);
          let oldFirstVisitAt = _.get(oldRecordList, [0, 'firstVisitAt'], 0);
          let data = {
            projectId,
            ucid,
            firstVisitAt,
            country,
            province,
            city,
            updateTime: updateAt,
          };
          let isSuccess = false;
          if (id > 0) {
            if (oldFirstVisitAt > 0 && oldFirstVisitAt > firstVisitAt) {
              // 有更新的数据时更新一下
              let affectRows = await this.updateUserFirstLoginAt(id, data);
              isSuccess = affectRows > 0;
            }
          } else {
            data['createTime'] = updateAt;
            let insertResult = await this.insertUserFirstLoginAt(data);
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
  }

  /**
   * 过滤所有已存在在数据库中的ucid(使用Set, 以便区分Map和Object)
   * @param {*} projectId
   * @param {*} allUcidList
   * @returns {object}
   */
  async filterExistUcidSetInDb(projectId, allUcidList) {
    let rawRecordList = await this.userFirstLoginAtRepository
      .createQueryBuilder('TRUserFirstLoginAt')
      .where('TRUserFirstLoginAt.projectId=:projectId', { projectId })
      .andWhere('TRUserFirstLoginAt.ucid IN (:...allUcidList)', {
        allUcidList,
      })
      .getMany()
      .catch(e => {
        return [];
      });
    let existUcidSet = new Set();
    for (let rawRecord of rawRecordList) {
      let ucid = _.get(rawRecord, ['ucid'], '');
      existUcidSet.add(ucid);
    }
    return existUcidSet;
  }
  /**
   * 获取老记录
   */
  async getOldRecordList(projectId, ucid) {
    // 返回值是一个列表s

    let oldRecordList = await this.userFirstLoginAtRepository
      .createQueryBuilder()
      .where({ projectId, ucid })
      .getMany()
      .catch(e => {
        return [];
      });
    return oldRecordList;
  }
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updateUserFirstLoginAt = async (id, data) => {
    let result = await this.userFirstLoginAtRepository.findOne({
      id,
    });
    let updateResult = await this.userFirstLoginAtRepository.save({
      ...result,
      ...data,
    });
    return updateResult;
  };

  /**
   * 插入页面统计
   * @param id
   * @param data
   */
  async insertUserFirstLoginAt(data) {
    // 返回值是一个列表
    return await this.userFirstLoginAtRepository.save(data);
  }
}
