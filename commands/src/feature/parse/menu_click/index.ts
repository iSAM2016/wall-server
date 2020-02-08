/* 用户点击情况
 * @Author: isam2016
 * @Date: 2020-01-14 10:30:17
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:12
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../parseBase';
import { Inject } from 'typescript-ioc';
import { EndParse, StartPase } from '../../../utils';
import { ParseInterface } from '../../../utils';
import { getFlattenCityRecordListInDistribution } from '../../../utils';
import {
  BehaviorDistributionService,
  CityDistributionService,
} from '../../../shard';
import {
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_HOUR,
  UNIT,
} from '../../../config';

class MenuClick extends ParseBase implements ParseInterface {
  constructor() {
    super();
  }
  // 统一按项目进行统计
  projectMap = new Map();
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  @Inject
  behaviorDistributionService: BehaviorDistributionService;
  @Inject
  cityDistributionService: CityDistributionService;
  static get signature() {
    return `
     Parse:MenuClick 
     {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
  }

  static get description() {
    return '[按天] 解析nginx日志, 用户点击情况';
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
    let projectId = _.get(record, ['project_id'], '');
    let name = _.get(record, ['info:', 'message'], '');
    let code = _.get(record, ['info', 'code'], '');
    let url = _.get(record, ['currentUrl'], '');

    url = decodeURIComponent(url) + ''; // 强制转换为字符串
    if (url.length > 200) {
      // url最长是200个字符
      url = url.slice(0, 200);
    }
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let recordAt = _.get(record, ['time'], 0);
    let countAtTime = moment.unix(recordAt).format(DATABASE_BY_HOUR);
    let distributionPath = [country, province, city];

    let distributeCountCount = 1;
    let countAtMap = new Map();
    let codeMap = new Map();
    let distribution = {};
    if (this.projectMap.has(projectId)) {
      countAtMap = this.projectMap.get(projectId);
      if (countAtMap.has(countAtTime)) {
        codeMap = countAtMap.get(countAtTime);
        if (codeMap.has(code)) {
          let recordPackage = codeMap.get(code);
          distribution = _.get(recordPackage, ['distribution'], {});
          if (_.has(distribution, distributionPath)) {
            let oldDistributeCount = _.get(distribution, distributionPath, 0);
            distributeCountCount = distributeCountCount + oldDistributeCount;
          }
        }
      }
    }
    _.set(distribution, distributionPath, distributeCountCount);
    let recordPackage = {
      code,
      distribution,
      name,
      url,
    };
    codeMap.set(code, recordPackage);
    countAtMap.set(countAtTime, codeMap);
    this.projectMap.set(projectId, countAtMap);
    return true;
  }
  /**
   * 判断该条记录是不是uv记录 格式
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(record): boolean {
    let recordType = _.get(record, ['type'], '');
    if (!recordType.includes('BEHAVIOR')) {
      return false;
    }
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
    for (let [projectId, countAtMap] of this.projectMap) {
      for (let [countAtTime, codeMap] of countAtMap) {
        for (let [code, recordPackage] of codeMap) {
          let { distribution, name, url } = recordPackage;
          let recordList = getFlattenCityRecordListInDistribution(distribution);
          let totalCount = 0;
          for (let record of recordList) {
            totalCount = totalCount + record;
          }
          let oldRecordList = await this.behaviorDistributionService.replaceRecord(
            projectId,
            code,
            countAtTime,
            UNIT.HOUR,
          );

          let isSuccess = await this.checkSaveCount(
            url,
            name,
            code,
            projectId,
            totalCount,
            countAtTime,
            oldRecordList,
            distribution,
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
    }
    return { totalRecordCount, processRecordCount, successSaveCount };
  }
  /**
   * 更新城市分布图
   */
  async checkSaveCount(
    url,
    name,
    code,
    projectId,
    totalCount,
    countAtTime,
    oldRecordList,
    cityDistribute,
  ): Promise<boolean> {
    // 利用get方法, 不存在直接返回0, 没毛病
    let cityDistributeIdInDb = _.get(
      oldRecordList,
      [0, 'city_distribute_id'],
      0,
    );
    let updateAt = moment().unix();
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let createTimeInDb = _.get(oldRecordList, [0, 'create_time'], 0);

    let data = {
      project_id: projectId,
      count_at_time: countAtTime,
      count_type: UNIT.HOUR,
      code,
      name,
      url,
      total_count: totalCount,
      update_time: moment().unix(),
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
    let affectRows = await this.behaviorDistributionService.updateBehavior(
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

    let insertResult = await this.behaviorDistributionService.insertDuration(
      data,
    );
    let insertId = _.get(insertResult, [0], 0);
    return insertId > 0;
  }
}

export default MenuClick;
