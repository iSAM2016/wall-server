import * as _ from 'lodash';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { UvService } from '../../uv/uv.service';
import {
  UNIT,
  DISPLAY_BY_MINUTE,
  DATABASE_BY_UNIT,
  COMMAND_ARGUMENT_BY_MONTH,
  COMMAND_ARGUMENT_BY_HOUR,
  COMMAND_ARGUMENT_BY_DAY,
  COMMAND_ARGUMENT_BY_UNIT,
} from '@utils';
import { Injectable, Logger } from '@nestjs/common';
import {
  ProjectService,
  UniqueViewService,
  CityDistributionService,
} from '../../shard';
/**
 *  分析uv 按 小时/天/月
 */
@Injectable()
export class SummaryUvService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly uniqueViewService: UniqueViewService,
    private readonly cityDistributionService: CityDistributionService,
    private readonly uvService: UvService,
  ) {}

  private readonly logger = new Logger(SummaryUvService.name);

  public projectMap = {};
  public logCounter = 0;
  public legalLogCounter = 0;

  // 每小时分析uv
  @Cron('0 0 */1 * * *')
  async summaryUvByHour() {
    let countType = UNIT.HOUR;
    this.logger.log(`所统计时间, ${UNIT.HOUR} 为 ${COMMAND_ARGUMENT_BY_HOUR}`);
    this.beginExecute(countType);
  }
  // 每日分析uv
  @Cron('0 0 0 * * *')
  async summaryUvByDay() {
    let countType = UNIT.DAY;
    this.logger.log(`所统计时间, ${countType} 为 ${COMMAND_ARGUMENT_BY_DAY}`);
    this.beginExecute(countType);
  }
  // 每月分析uv
  // 每月的1日0点0分0秒触发
  @Cron('0 0 0 1 * *')
  async summaryUvByMonth() {
    let countType = UNIT.MONTH;
    this.logger.log(`所统计时间, ${countType} 为 ${COMMAND_ARGUMENT_BY_MONTH}`);
    this.beginExecute(countType);
  }

  /**
   * 开始执行任务
   * @param startAt  开始时间
   * @param endAt 结束时间
   * @param countType  统计类型
   * countAtMoment 当前时间
   */
  async beginExecute(countType) {
    let agoByTime = moment()
      .subtract(1, countType as any)
      .unix();
    let endAt =
      moment()
        .clone()
        .unix() - 1;
    let countAtMoment = moment
      .unix(agoByTime)
      .format(COMMAND_ARGUMENT_BY_UNIT[countType]);
    let startAt = agoByTime;

    let startAtMoment = moment.unix(startAt);
    let endAtMoment = moment.unix(endAt);
    let rawProjectList = await this.projectService.getList();
    for (let [id, rawProject] of rawProjectList) {
      let projectId = _.get(rawProject, 'id', '');
      let projectDesc = _.get(rawProject, 'cDesc', '');
      if (projectId === 0 || projectId === '') {
        continue;
      }
      this.logger.log(`开始处理项目${projectId}(${projectDesc})的数据`);
      this.logger.log(
        `[${projectId}(${projectDesc})] 时间范围:${startAtMoment.format(
          DISPLAY_BY_MINUTE,
        ) + ':00'}~${endAtMoment.format(DISPLAY_BY_MINUTE) + ':59'}`,
      );
      // 如果是hour，则用原始表数据
      if (countType === UNIT.HOUR) {
        await this.handleHour(
          projectId,
          startAt,
          endAt,
          countAtMoment,
          countType,
          projectDesc,
        );
      } else {
        await this.handleOther(
          projectId,
          startAt,
          endAt,
          countAtMoment,
          countType,
          projectDesc,
        );
      }
      this.logger.log(`项目${projectId}(${projectDesc})处理完毕`);
    }
  }
  /**
   * 其他类型统计
   * @param projectId
   * @param startAt
   * @param endAt
   * @param countAtMoment
   * @param countType
   * @param projectDesc
   */
  async handleOther(
    projectId,
    startAt,
    endAt,
    countAtMoment,
    countType,
    projectDesc,
  ) {
    let getType;
    switch (countType) {
      case UNIT.DAY:
        getType = UNIT.HOUR;
        break;
      case UNIT.MONTH:
        getType = UNIT.DAY;
        break;
      default:
        return;
    }
    let rawRecordList = await this.uniqueViewService.getRawRecordListInRange(
      projectId,
      startAt,
      endAt,
      getType,
    );
    let totalUv = 0;
    let cityIdList = [];
    for (let rawRecord of rawRecordList) {
      // 更新总数
      let { cityDistributeId, totalCount: count } = rawRecord;
      totalUv += count;
      // 添加城市id
      cityIdList.push(cityDistributeId);
    }
    // 处理城市分布
    let cityDistribute = {};

    let rawCityRecordList = await this.cityDistributionService.getByIdListInOneMonth(
      projectId,
      cityIdList,
      countAtMoment,
    );
    for (let rawCityRecord of rawCityRecordList) {
      let cityDistributeString = _.get(
        rawCityRecord,
        ['cityDistributeJson'],
        {},
      );
      if (cityDistributeString === null) continue;
      let rawCityJson = JSON.parse(cityDistributeString);
      for (let country of Object.keys(rawCityJson)) {
        for (let province of Object.keys(rawCityJson[country])) {
          for (let city of Object.keys(rawCityJson[country][province])) {
            let oldCount = _.get(cityDistribute, [country, province, city], 0);
            let count = _.get(rawCityJson, [country, province, city], 0);
            _.set(cityDistribute, [country, province, city], count + oldCount);
          }
        }
      }
    }
    this.logger.log(
      `[${projectId}(${projectDesc})] 城市分布数据获取完毕 => ${JSON.stringify(
        cityDistribute,
      )}   totalUv => ${totalUv}将记录更新到数据库中`,
    );
    this.uniqueViewService.replaceUvRecord(
      projectId,
      totalUv,
      countAtMoment,
      countType,
      cityDistribute,
    );
  }
  async handleHour(
    projectId,
    startAt,
    endAt,
    countAtMoment,
    countType,
    projectDesc,
  ) {
    let cityDistribute = await this.uvService.getCityDistributeInRange(
      projectId,
      startAt,
      endAt,
    );
    let uvCountList = this.cityDistributionService.getFlattenCityRecordListInDistribution(
      cityDistribute,
    );
    let totalUv = 0;
    for (let uvCount of uvCountList) {
      totalUv = totalUv + uvCount;
    }
    this.logger.log(
      `[${projectId}(${projectDesc})] 城市分布数据获取完毕 => ${JSON.stringify(
        cityDistribute,
      )}  totalUv => ${totalUv}将记录更新到数据库中`,
    );
    this.uniqueViewService.replaceUvRecord(
      projectId,
      totalUv,
      countAtMoment,
      countType,
      cityDistribute,
    );
  }
}
