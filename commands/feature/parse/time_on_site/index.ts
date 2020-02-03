/* 解析用户停留时间
 * @Author: isam2016
 * @Date: 2020-01-13 11:25:52
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:31
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../parseBase';
import { Inject } from 'typescript-ioc';
import { EndParse, StartPase } from 'commands/utils/annotation';
import { ParseInterface } from 'commands/utils/interface';
import { getFlattenCityRecordListInDistribution } from '@commands/utils';
import { UniqueViewService, CityDistributionService } from '@commands/shard';
import { DurationDistributionService } from './duration_distribution.service';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  UNIT,
  DATABASE_BY_HOUR,
} from '@commands/config';

class TimeOnSiteByHour extends ParseBase implements ParseInterface {
  // 统一按项目进行统计
  projectMap = new Map();
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  @Inject
  uniqueViewService: UniqueViewService;
  @Inject
  durationDistributionService: DurationDistributionService;
  @Inject
  cityDistributionService: CityDistributionService;
  static get signature() {
    return `
     Parse:TimeOnSiteByHour 
     {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
  }

  static get description() {
    return '[按小时] 解析nginx日志, 分析记录指定时间范围内用户停留时长';
  }

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
      this.log(error.message);
    }
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
   *  2.将日志存储到MAP 集合当中
   */
  readLogSaveToCache(record): boolean {
    try {
      let projectId = _.get(record, ['project_id'], 0);
      let durationMs = _.get(record, ['detail', 'duration_ms'], 0);
      let country = _.get(record, ['country'], '');
      let province = _.get(record, ['province'], '');
      let city = _.get(record, ['city'], '');
      let recordAt = _.get(record, ['time'], 0);
      let countAtTime = moment.unix(recordAt).format(DATABASE_BY_HOUR);
      let distributionPath = [country, province, city];

      let countAtMap = new Map();
      let distribution = {};
      // 项目=> 时间周期 => 停留时间
      if (this.projectMap.has(projectId)) {
        countAtMap = this.projectMap.get(projectId);
        if (countAtMap.has(countAtTime)) {
          // 是否存在当前的时间段
          distribution = countAtMap.get(countAtTime);
          if (_.has(distribution, distributionPath)) {
            // 是否有当前的城市
            let oldDurationMs = _.get(distribution, distributionPath, 0); // 停留时间叠加
            durationMs = durationMs + oldDurationMs;
          }
        }
      }
      _.set(distribution, distributionPath, durationMs);
      countAtMap.set(countAtTime, distribution);
      this.projectMap.set(projectId, countAtMap);
      return true;
    } catch (error) {
      this.alert.sendMessage(
        String(this.config.get('ALERT_WATCH_UCID_LIST')),
        error.message,
      );
      this.log(error.message);
    }
  }

  /**
   *3.存储到数据库
   * @memberof ParseUV
   */
  @EndParse
  async saveTODB() {
    try {
      let totalRecordCount = this.getRecordCountInProjectMap(); // 日志总数
      let processRecordCount = 0;
      let successSaveCount = 0; // 成功的条数
      for (let [projectId, countAtMap] of this.projectMap) {
        for (let [countAtTime, distribution] of countAtMap) {
          //  统计每个城市 停留时间集合
          let recordList = getFlattenCityRecordListInDistribution(distribution);
          let totalStayMs = 0;
          // 计算停留的总数
          for (let record of recordList) {
            totalStayMs = totalStayMs + record;
          }
          //获取当前项目，当前时间段 uv 记录数
          let totalUv = await this.uniqueViewService.getTotalUv(
            projectId,
            countAtTime,
            UNIT.HOUR,
          );
          //当前项目 当前时用户停留记录
          let oldRecordList = await this.durationDistributionService.replaceUvRecord(
            projectId,
            countAtTime,
            UNIT.HOUR,
          );
          let isSuccess = await this.checkSaveCount(
            totalUv,
            oldRecordList,
            projectId,
            countAtTime,
            distribution,
            totalStayMs,
          );
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
  /**
   * 更新城市分布图
   * @param totalUv 获取当前项目，当前时间段 uv记录数总数
   * @param oldRecordList 当前项目 当前时用户停留记录
   * @param projectId
   * @param countAtTime
   * @param cityDistribute 用户分布区域
   * @param totalStayMs 用户在不同区域停留的秒数总和
   */
  async checkSaveCount(
    totalUv,
    oldRecordList,
    projectId,
    countAtTime,
    cityDistribute,
    totalStayMs,
  ): Promise<boolean> {
    let updateAt = moment().unix();
    // 利用get方法, 不存在直接返回0, 没毛病
    let cityDistributeIdInDb = _.get(
      oldRecordList,
      [0, 'city_distribute_id'],
      0,
    );
    //
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let createTimeInDb = _.get(oldRecordList, [0, 'create_time'], 0);

    let data = {
      project_id: projectId,
      total_uv: totalUv,
      count_at_time: countAtTime,
      update_time: moment().unix(),
      count_type: UNIT.HOUR,
      total_stay_ms: totalStayMs,
    };

    let isSuccess: boolean = false;
    if (id > 0) {
      isSuccess = await this.updateCityDistribution(
        id,
        data,
        projectId,
        createTimeInDb,
        cityDistribute,
        cityDistributeIdInDb,
      );
    } else {
      isSuccess = await this.insertCityDistributionRecord(
        cityDistribute,
        data,
        projectId,
        updateAt,
      );
    }
    return isSuccess;
  }
  // 更新城市分布数据
  async updateCityDistribution(
    id,
    data,
    projectId,
    createTimeInDb,
    cityDistribute,
    cityDistributeIdInDb,
  ): Promise<boolean> {
    // 更新城市分布数据
    let isUpdateSuccess = await this.cityDistributionService.updateCityDistributionRecord(
      cityDistributeIdInDb,
      projectId,
      createTimeInDb,
      JSON.stringify(cityDistribute),
    );
    if (isUpdateSuccess === false) {
      return false;
    }
    let affectRows = await this.durationDistributionService.updateDuration(
      id,
      data,
    );
    return affectRows > 0;
  }

  // 首先插入城市分布数据
  async insertCityDistributionRecord(
    cityDistribute,
    data,
    projectId,
    updateAt,
  ): Promise<boolean> {
    let cityDistributeId = await this.cityDistributionService.insertCityDistributionRecord(
      JSON.stringify(cityDistribute),
      projectId,
      updateAt,
    );
    if (cityDistributeId === 0) {
      // 城市分布数据插入失败
      return false;
    }
    data['city_distribute_id'] = cityDistributeId;
    data['create_time'] = moment().unix();
    let insertResult = await this.durationDistributionService.insertDuration(
      data,
    );
    let insertId = _.get(insertResult, [0], 0);
    return insertId > 0;
  }
  /**
   * 统计 projectUvMap 中的记录总数
   */
  getRecordCountInProjectMap() {
    let totalCount = 0;
    for (let [projectId, countAtMap] of this.projectMap) {
      for (let [countAtTime, distribution] of countAtMap) {
        totalCount = totalCount + 1;
      }
    }
    return totalCount;
  }
}

export default TimeOnSiteByHour;
