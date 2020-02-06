/*  浏览器性能
 * @Author: isam2016
 * @Date: 2020-01-13 11:25:52
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:31
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../parseBase';
import { Inject } from 'typescript-ioc';
import { EndParse, StartPase } from '../../../utils';
import { ParseInterface } from '../../../utils';
import { CityDistributionService } from '../../../shard';
import { PerformanceService } from './performance.service';
import {
  UNIT,
  DATABASE_BY_UNIT,
  DATABASE_BY_MINUTE,
  COMMAND_ARGUMENT_BY_MINUTE,
} from '../../../config';

class Performance extends ParseBase implements ParseInterface {
  // 统一按项目进行统计
  projectMap = new Map();
  startAtMoment: moment.Moment;
  endAtMoment: moment.Moment;
  @Inject
  performanceService: PerformanceService;
  @Inject
  cityDistributionService: CityDistributionService;
  static get signature() {
    return `
     Parse:Performance 
     {startAtYmdHi:日志扫描范围上限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     {endAtYmdHi:日志扫描范围下限${COMMAND_ARGUMENT_BY_MINUTE}格式}
     `;
  }

  static get description() {
    return '[按小时] 解析kafka日志, 分析分钟级别的指定时间范围内的性能指标';
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
      let visitAt = _.get(record, ['time'], 0);
      let projectId = _.get(record, ['project_id'], 0);
      let country = _.get(record, ['country'], '');
      let province = _.get(record, ['province'], '');
      let city = _.get(record, ['city'], '');
      // 数据都在detail里
      let detail = _.get(record, ['details'], {
        dns_lookup_ms: 1,
        tcp_connect_ms: 1,
        response_request_ms: 1,
        response_transfer_ms: 1,
        dom_parse_ms: 1,
        load_resource_ms: 1,
        ssl_connect_ms: 1,
        first_render_ms: 1,
        first_tcp_ms: 1,
        first_response_ms: 1,
        dom_ready_ms: 1,
        load_complete_ms: 1,
        url: '909090',
      }); //TODO: test
      let url = _.get(detail, ['url'], '');
      if (
        _.isNumber(visitAt) === false ||
        visitAt === 0 ||
        _.isEmpty(detail) ||
        _.isString(url) === false ||
        url.length === 0
      ) {
        this.log(
          `数据不合法, 自动跳过 visitAt => ${visitAt}`,
          'detail =>',
          detail,
          'url =>',
          url,
        );
        return false;
      }
      let countAtMinute = moment.unix(visitAt).format(DATABASE_BY_MINUTE);
      delete detail.url;
      for (let indicator of Object.keys(detail)) {
        let indicatorValue = detail[indicator];
        // 初始化Map路径
        let uniqIdPath = [projectId, url, indicator, countAtMinute]; // 记录唯一key
        let locationPath = [country, province, city]; // 路径地址
        // 初始化Map对象
        let uniqIdMap = new Map();
        let result = { sum_indicator_value: 0, pv: 0 };
        uniqIdMap.set(locationPath, result);

        // 检查projectMap中是否有对应记录, 如果有, 使用projectMap中的记录
        if (this.projectMap.has(uniqIdPath)) {
          uniqIdMap = this.projectMap.get(uniqIdPath);
          if (uniqIdMap.has(locationPath)) {
            result = uniqIdMap.get(locationPath);
          } else {
            uniqIdMap.set(locationPath, result);
          }
        } else {
          this.projectMap.set(uniqIdPath, uniqIdMap);
        }

        result['sum_indicator_value'] += indicatorValue;
        result['pv'] += 1;

        // 将记录更新回Map中
        uniqIdMap.set(locationPath, result);
        this.projectMap.set(uniqIdPath, uniqIdMap);
      }
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
      let totalRecordCount = this.getRecordCountInProjectMap();
      let processRecordCount = 0;
      let successSaveCount = 0;

      for (let [[projectId, url, indicator, countAtMinute], uniqIdMap] of this
        .projectMap) {
        let cityDistribute = {};
        let sumIndicatorValueTotal = 0;
        let pvTotal = 0;
        for (let [[country, province, city], record] of uniqIdMap) {
          let { sum_indicator_value: sumIndicatorValue, pv } = record;
          _.set(cityDistribute, [country, province, city], {
            pv,
            sum_indicator_value: sumIndicatorValue,
          });
          pvTotal = pvTotal + pv;
          sumIndicatorValueTotal = sumIndicatorValueTotal + sumIndicatorValue;
        }
        let countAt = moment(
          countAtMinute,
          DATABASE_BY_UNIT[UNIT.MINUTE],
        ).unix();
        let oldRecordList = await this.performanceService.getRecordList(
          projectId,
          url,
          indicator,
          countAt,
          UNIT.MINUTE,
        );
        console.log(oldRecordList);
        let id = _.get(oldRecordList, [0, 'id'], 0);
        console.log(id);

        let isSuccess = await this.checkSaveCount(
          url,
          countAt,
          indicator,
          pvTotal,
          projectId,
          UNIT.MINUTE,
          oldRecordList,
          cityDistribute,
          sumIndicatorValueTotal,
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
        return { totalRecordCount, processRecordCount, successSaveCount };
      }
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
   */
  async checkSaveCount(
    url,
    countAt,
    indicator,
    pv,
    projectId,
    countType,
    oldRecordList,
    cityDistribute,
    sumIndicatorValue,
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
    let dateFormat = DATABASE_BY_UNIT[countType];
    let countAtTime = moment.unix(countAt).format(dateFormat);
    let data = {
      url,
      indicator,
      pv,
      count_at_time: countAtTime,
      count_type: countType,
      sum_indicator_value: sumIndicatorValue,
      update_time: updateAt,
    };

    let isSuccess: boolean = false;
    if (id > 0) {
      isSuccess = await this.updateCityDistribution(
        id,
        data,
        projectId,
        countAt,
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
    countAt,
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
    let affectRows = await this.performanceService.updatePerformance(
      id,
      data,
      projectId,
      countAt,
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

    let insertResult = await this.performanceService.insertPerformance(
      data,
      projectId,
      updateAt,
    );
    let insertId = _.get(insertResult, [0], 0);
    return insertId > 0;
  }

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

export default Performance;
