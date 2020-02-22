/* 解析用户停留时间
 * @Author: isam2016
 * @Date: 2020-01-13 11:25:52
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:31
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { ConfigService } from '@core';
import { AlertService } from '@shared';
import { Cron } from '@nestjs/schedule';
import { TRDurationDistribution } from '@entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { UniqueViewService } from '../shard/uniqueView/uniqueView.service';
import { CityDistributionService } from '../shard/cityDistribution/cityDistribution.service';

import {
  UNIT,
  DATABASE_BY_HOUR,
  DATABASE_BY_UNIT,
  COMMAND_ARGUMENT_BY_MINUTE,
  getFlattenCityRecordListInDistribution,
} from '@utils';

const DateFormat = 'YYYYMM';

@Injectable()
export class TimeOnSiteService extends ParseBase {
  constructor(
    @InjectRepository(TRDurationDistribution)
    private readonly durationDistributionRepository: Repository<
      TRDurationDistribution
    >,
    private readonly config: ConfigService,
    private readonly alertService: AlertService,
    private readonly uniqueViewService: UniqueViewService,
    private readonly cityDistributionService: CityDistributionService,
  ) {
    super();
  }

  private readonly logger = new Logger(TimeOnSiteService.name);
  private projectMap = new Map();
  private endAtMoment;
  private startAtMoment;

  @Cron('0 */10 * * * *')
  // @Cron('0 */3 * * * *')
  async handle() {
    let nowByMinute = moment();
    let fifteenMinuteAgoByminute = moment().subtract(10, 'minute');
    this.startAtMoment = fifteenMinuteAgoByminute;
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
    // 不用类别判断
    let projectId = _.get(record, ['project_id'], 0);
    let durationMs = _.get(record, ['info', 'duration_ms'], 0);
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let recordAt = _.get(record, ['time'], 0);
    let countAtTime = moment.unix(recordAt).format(DATABASE_BY_HOUR);
    // 设置访问地址map
    let distributionPath = [country, province, city];
    let countAtMap = new Map();
    let distribution = {};
    // 项目=> 时间周期 => 停留时间
    // 12 => Map { '2020-02-07_07' => { '北京市': { '北京市': { '': 30383 } } } }
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
  }
  /**
   * 判断该条记录是不是uv记录 格式
   * @param {Object} record
   * @return {Boolean}
   */
  isLegalRecord(record): boolean {
    return true;
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
  /**
   *3.存储到数据库
   * @memberof ParseUV
   */
  async saveTODB() {
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
        let oldRecordList = await this.replaceUvRecord(
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
  }
  /**
   * 更新城市分布图并插入数据
   */
  async checkSaveCount(
    totalUv,
    oldRecordList,
    projectId,
    countAtTime,
    cityDistribute,
    totalStayMs,
  ): Promise<boolean> {
    // 利用get方法, 不存在直接返回0, 没毛病
    let cityDistributeIdInDb = _.get(oldRecordList, [0, 'cityDistributeId'], 0);
    let updateAt = moment().unix();
    let id = _.get(oldRecordList, [0, 'id'], 0);

    let data = {
      projectId,
      totalUv,
      countAtTime,
      updateTime: moment().unix(),
      countType: UNIT.HOUR,
      totalStayMs,
    };

    let isSuccess: boolean = false;
    if (id > 0) {
      isSuccess = await this.updateCityDistribution(
        id,
        data,
        cityDistribute,
        cityDistributeIdInDb,
      );
    } else {
      isSuccess = await this.insertData(
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
    cityDistribute,
    cityDistributeIdInDb,
  ): Promise<boolean> {
    // 更新城市分布数据
    let isUpdateSuccess = await this.cityDistributionService.updateCityDistributionRecord(
      cityDistributeIdInDb,
      JSON.stringify(cityDistribute),
    );
    if (isUpdateSuccess === false) {
      return false;
    }
    let affectRows = await this.updateDuration(id, data);
    return affectRows > 0;
  }
  // 插入数据
  async insertData(
    cityDistribute,
    data,
    projectId,
    updateAt,
  ): Promise<boolean> {
    // 首先插入城市分布数据
    let cityDistributeId = await this.cityDistributionService.insertCityDistributionRecord(
      JSON.stringify(cityDistribute),
      projectId,
      updateAt,
    );
    if (cityDistributeId === 0) {
      // 城市分布数据插入失败
      return false;
    }
    data['cityDistributeId'] = cityDistributeId;
    data['createTime'] = moment().unix();
    let insertResult = await this.insertDuration(data);
    let insertId = _.get(insertResult, 'id', 0);
    return insertId > 0;
  }
  /**
   * 自动创建 停留记录
   */
  replaceUvRecord = async (projectId, countAtTime, countType) => {
    let oldRecordList = await this.durationDistributionRepository
      .createQueryBuilder()
      .where({
        projectId,
        countAtTime,
        countType,
      })
      .getMany();
    return oldRecordList;
  };
  /**
   *更新 停留时间
   *
   * @memberof DurationDistributionService
   */
  updateDuration = async (id, data) => {
    let result = await this.durationDistributionRepository.findOne({
      id,
    });
    let updateResult = await this.durationDistributionRepository.save({
      ...result,
      ...data,
    });
    return updateResult;
  };

  /**
   * 插入用户停留时间数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表
    return await this.durationDistributionRepository.save(data);
  }
  /**
   *  按时间格式类别获取 停留时间数据
   * @param projectId
   * @param startAt
   * @param finishAt
   * @param countType  时间格式
   */
  async getRecordList(projectId, startAt, finishAt, countType) {
    let countAtTimeList = [];
    let dateFormat = DATABASE_BY_UNIT[countType];
    let addDateRange = 'day';
    switch (countType) {
      case UNIT.HOUR:
        addDateRange = 'hour';
        break;
      case UNIT.DAY:
        addDateRange = 'day';
        break;
      case UNIT.MONTH:
        addDateRange = 'month';
        break;
      default:
        addDateRange = 'month';
    }
    let finishAtMoment = moment.unix(finishAt);

    for (
      let currentAtMoment = moment.unix(startAt);
      currentAtMoment.isBefore(finishAtMoment);
      currentAtMoment = (currentAtMoment.clone() as any).add(1, addDateRange)
    ) {
      let currentAtFormated = currentAtMoment.format(dateFormat);
      countAtTimeList.push(currentAtFormated);
    }
    let recordList = await this.durationDistributionRepository
      .createQueryBuilder('TRDurationDistribution')
      .where('TRDurationDistribution.projectId=:projectId', { projectId })
      .andWhere('TRDurationDistribution.countType=:countType', { countType })
      .andWhere('TRDurationDistribution.countAtTime IN (:...countAtTimeList)', {
        countAtTimeList,
      })
      .orderBy('TRDurationDistribution.countAtTime', 'ASC')
      .getMany()
      .catch(e => {
        this.alertService.sendMessage(
          this.config.get('ALERT_WATCH_UCID_LIST'),
          e.mssage,
        );
        return [];
      });
    return recordList;
  }
}
