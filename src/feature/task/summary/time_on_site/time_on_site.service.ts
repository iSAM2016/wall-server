import * as _ from 'lodash';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { TimeOnSiteService } from '../../time_on_site/time_on_site.service';
import {
  UNIT,
  DISPLAY_BY_MINUTE,
  DATABASE_BY_UNIT,
  COMMAND_ARGUMENT_BY_MONTH,
  COMMAND_ARGUMENT_BY_HOUR,
  COMMAND_ARGUMENT_BY_DAY,
} from '@utils';
import { Injectable, Logger } from '@nestjs/common';
import {
  ProjectService,
  UniqueViewService,
  CityDistributionService,
} from '../../shard';
/**
 *  分析TimeOnSite 用户停留时间 按 小时/天/月 统计
 */
@Injectable()
export class SummaryTimeOnSiteService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly uniqueViewService: UniqueViewService,
    private readonly timeOnSiteService: TimeOnSiteService,
    private readonly cityDistributionService: CityDistributionService,
  ) {}

  private readonly logger = new Logger(SummaryTimeOnSiteService.name);

  public projectMap = {};
  public logCounter = 0;
  public legalLogCounter = 0;

  // 每小时分析uv
  @Cron('0 0 */1 * * *')
  async summaryUvByHour() {
    this.logger.log(`所统计时间, ${UNIT.HOUR} 为 ${COMMAND_ARGUMENT_BY_HOUR}`);
    let countAtMoment = moment();
    let startAt = countAtMoment.unix();
    let endAt =
      countAtMoment
        .clone()
        .add(1, 'hours')
        .unix() - 1;

    this.beginExecute(startAt, endAt, UNIT.HOUR, countAtMoment);
  }
  // 每日分析uv
  @Cron('0 0 0 * * *')
  async summaryUvByDay() {
    this.logger.log(`所统计时间, ${UNIT.DAY} 为 ${COMMAND_ARGUMENT_BY_DAY}`);
    let countAtMoment = moment();
    let startAt = countAtMoment.unix();
    let endAt =
      countAtMoment
        .clone()
        .add(1, 'day')
        .unix() - 1;

    this.beginExecute(startAt, endAt, UNIT.DAY, countAtMoment);
  }
  // 每月分析uv
  // 每月的1日0点0分0秒触发
  @Cron('0 0 0 1 * *')
  async summaryUvByMonth() {
    this.logger.log(
      `所统计时间, ${UNIT.MONTH} 为 ${COMMAND_ARGUMENT_BY_MONTH}`,
    );
    // `所统计时间, ${UNIT.HOUR} 为 ${COMMAND_ARGUMENT_BY_HOUR}, ${UNIT.DAY} 为 ${COMMAND_ARGUMENT_BY_DAY}, ${UNIT.MONTH} 为 ${COMMAND_ARGUMENT_BY_MONTH}`,
    let countAtMoment = moment();
    let startAt = countAtMoment.unix();
    let endAt =
      countAtMoment
        .clone()
        .add(1, 'month')
        .unix() - 1;

    this.beginExecute(startAt, endAt, UNIT.MONTH, countAtMoment);
  }

  /**
   * 开始执行任务
   * @param startAt  开始时间
   * @param endAt 结束时间
   * @param countType  统计类型
   * countAtMoment 当前时间
   */
  async beginExecute(startAt, endAt, countType, countAtMoment) {
    let startAtMoment = moment.unix(startAt);
    let endAtMoment = moment.unix(endAt);
    let rawProjectList = await this.projectService.getList();
    for (let [id, rawProject] of rawProjectList) {
      let projectId = _.get(rawProject, 'id', '');
      let projectDesc = _.get(rawProject, 'cDesc', '');
      let projectName = _.get(rawProject, 'projectName', '');
      if (projectId === 0 || projectId === '') {
        continue;
      }
      this.logger.log(`开始处理项目${projectId}(${projectDesc})的数据`);
      this.logger.log(
        `[${projectId}(${projectDesc})] 时间范围:${startAtMoment.format(
          DISPLAY_BY_MINUTE,
        ) + ':00'}~${endAtMoment.format(DISPLAY_BY_MINUTE) + ':59'}`,
      );
      // 按时间格式类别获取 停留时间数据
      let rawRecordList = await this.timeOnSiteService.getRecordList(
        projectId,
        startAt,
        endAt,
        UNIT.HOUR,
      );
      let totalStayMs = 0;
      let cityDistribute = {};
      for (let rawRecord of rawRecordList) {
        totalStayMs =
          Number(totalStayMs) + Number(_.get(rawRecord, ['totalStayMs'], 0));
        let cityDistributeId = _.get(rawRecord, ['cityDistributeId'], 0);
        // 获取解析后的城市分布记录, 解析失败返回空对象({})
        let oldCityDistribute = await this.cityDistributionService.getCityDistributionRecord(
          cityDistributeId,
        );
        cityDistribute = await this.cityDistributionService.mergeDistributionData(
          oldCityDistribute,
          cityDistribute,
        );
      }
      let countAtTime = countAtMoment.format(DATABASE_BY_UNIT[countType]);
      // 获取总uv, 记录不存在返回0
      let totalUv = await this.uniqueViewService.getTotalUv(
        projectId,
        moment(countAtMoment).format(DATABASE_BY_UNIT[countType]),
        countType,
      );
      // 录入数据
      let oldRecordList = await this.timeOnSiteService.replaceUvRecord(
        projectId,
        countAtTime,
        UNIT.HOUR,
      );
      let isSuccess = await this.checkSaveCount(
        totalUv,
        oldRecordList,
        projectId,
        countAtTime,
        cityDistribute,
        totalStayMs,
      );

      this.logger.log(
        `项目${projectId}(${projectName})数据处理完毕, 数据录入 => ${
          isSuccess ? '成功' : '失败'
        }`,
      );
    }
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
  // 更新城市分布数据 并录入
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
    let affectRows = await this.timeOnSiteService.updateDuration(id, data);
    return affectRows.id > 0;
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
    let insertResult = await this.timeOnSiteService.insertDuration(data);
    let insertId = _.get(insertResult, 'id', 0);
    return insertId > 0;
  }
}
