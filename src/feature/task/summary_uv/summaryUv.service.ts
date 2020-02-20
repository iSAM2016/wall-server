import * as _ from 'lodash';
import * as moment from 'moment';
import { ConfigService } from '@core';
import { Cron } from '@nestjs/schedule';
import { DISPLAY_BY_MINUTE, UNIT } from '@utils';
import { Injectable, Logger } from '@nestjs/common';
import { ProjectService } from '../shard/project/project.service';
/**
 *  分析uv 按 小时/天/月
 */
@Injectable()
export class SummaryUvService {
  constructor(private readonly projectService: ProjectService) {}

  private readonly logger = new Logger(SummaryUvService.name);

  public projectMap = {};
  public logCounter = 0;
  public legalLogCounter = 0;
  /**
   *
   * @param startAt  开始时间
   * @param endAt 结束时间
   * @param countType  统计类型
   */
  async beginExecute(startAt, endAt, countType) {
    let startAtMoment = moment.unix(startAt);
    let endAtMoment = moment.unix(endAt);

    let rawProjectList = await this.projectService.getList();
    this.logger.log('项目列表获取完毕, =>' + JSON.stringify(rawProjectList));

    for (let rawProject of rawProjectList) {
      let projectId = _.get(rawProject, 'id', '');
      let projectDesc = _.get(rawProject, 'c_desc', '');
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
    let rawRecordList = await MUniqueView.getRawRecordListInRange(
      projectId,
      startAt,
      endAt,
      getType,
    );
    let totalUv = 0;
    let cityIdList = [];
    for (let rawRecord of rawRecordList) {
      // 更新总数
      let {
        city_distribute_id: cityDistributeId,
        total_count: count,
      } = rawRecord;
      totalUv += count;
      // 添加城市id
      cityIdList.push(cityDistributeId);
    }
    // 处理城市分布
    let cityDistribute = {};
    let rawCityRecordList = await MCityDistribution.getByIdListInOneMonth(
      projectId,
      cityIdList,
      startAt,
    );
    for (let rawCityRecord of rawCityRecordList) {
      let cityDistributeString = _.get(
        rawCityRecord,
        ['city_distribute_json'],
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
    this.log(
      `[${projectId}(${projectDesc})] 城市分布数据获取完毕 =>`,
      cityDistribute,
      `totalUv => ${totalUv}将记录更新到数据库中`,
    );
    MUniqueView.replaceUvRecord(
      projectId,
      totalUv,
      countAtMoment.format(DATE_FORMAT.DATABASE_BY_UNIT[countType]),
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
    let cityDistribute = await MUvRecord.getCityDistributeInRange(
      projectId,
      startAt,
      endAt,
    );
    let uvCountList = MCityDistribution.getFlattenCityRecordListInDistribution(
      cityDistribute,
    );
    let totalUv = 0;
    for (let uvCount of uvCountList) {
      totalUv = totalUv + uvCount;
    }
    this.log(
      `[${projectId}(${projectDesc})] 城市分布数据获取完毕 =>`,
      cityDistribute,
      `totalUv => ${totalUv}将记录更新到数据库中`,
    );
    MUniqueView.replaceUvRecord(
      projectId,
      totalUv,
      countAtMoment.format(DATE_FORMAT.DATABASE_BY_UNIT[countType]),
      countType,
      cityDistribute,
    );
  }
  // nginx 读取日志文件
  @Cron('0 */1 * * * *')
  async nginxSaveLog() {}
}
