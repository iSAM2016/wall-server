/* 解析UV-记录
 * @Author: isam2016
 * @Date: 2020-01-06 16:06:34
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 18:07:10
 * 独立访问用户数：即UniqueVisitor，访问网站的一台电脑客户端为一个访客。
 * 00:00-24:00内相同的客户端只被计算一次。
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TRUniqueView } from '@entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDatabaseTimeList } from '@utils';
import { CityDistributionService } from '../cityDistribution/cityDistribution.service';
/**
 *  uv 记录
 */
@Injectable()
export class UniqueViewService {
  constructor(
    @InjectRepository(TRUniqueView)
    private readonly uniqueViewRepository: Repository<TRUniqueView>,
    private readonly cityDistributionService: CityDistributionService,
  ) {}

  private readonly logger = new Logger(UniqueViewService.name);
  /**
   * 自动创建/替换总uv记录
   * @param {number} projectId
   * @param {number} totalCount
   * @param {number} countAtTime
   * @param {string} countType
   * @param {object} cityDistribute
   * @return {boolean}
   */
  async replaceUvRecord(
    projectId,
    totalCount,
    countAtTime,
    countType,
    cityDistribute,
  ) {
    let updateAt = moment().unix();
    // 返回值是一个列表
    let oldRecordList = await this.uniqueViewRepository
      .createQueryBuilder('TRUniqueView')
      .select([
        `TRUniqueView.cityDistributeId`,
        `TRUniqueView.createTime`,
        `TRUniqueView.id`,
      ])
      .where('TRUniqueView.projectId=:projectId', { projectId })
      .andWhere('TRUniqueView.countAtTime=:countAtTime', { countAtTime })
      .andWhere('TRUniqueView.countType=:countType', { countType })
      .getMany()
      .catch(() => {
        return [];
      });
    // 利用get方法, 不存在直接返回0, 没毛病
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let cityDistributeIdInDb = _.get(oldRecordList, [0, 'cityDistributeId'], 0);
    let data = {
      projectId,
      countAtTime,
      totalCount,
      countType,
      updateTime: String(updateAt),
    };
    let isSuccess = false;
    if (id > 0) {
      // 更新城市分布数据
      let isUpdateSuccess = await this.cityDistributionService.updateCityDistributionRecord(
        cityDistributeIdInDb,
        JSON.stringify(cityDistribute),
      );
      if (isUpdateSuccess === false) {
        return false;
      }
      let result = await this.uniqueViewRepository.findOne({ id });
      let affectRows = await this.uniqueViewRepository.save({
        ...result,
        ...data,
      });
      isSuccess = Number(affectRows.id) > 0;
    } else {
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
      data['totalCount'] = totalCount;
      data['createTime'] = String(updateAt);
      let insertResult = await this.uniqueViewRepository.save(data).catch(e => {
        return [];
      });
      let insertId = _.get(insertResult, 'id', 0);
      isSuccess = insertId > 0;
    }
    return isSuccess;
  }

  /**
   * 获取记录
   */
  async getRecord(projectId, countAtTime, countType) {
    // let tableName = getTableName();
    // let recordList = await Knex.select(TABLE_COLUMN)
    //   .from(tableName)
    //   .where('project_id', '=', projectId)
    //   .andWhere('count_at_time', '=', countAtTime)
    //   .andWhere('count_type', '=', countType)
    //   .catch(e => {
    //     return [];
    //   });
    // return _.get(recordList, [0], {});
  }

  /**
   * 获取总uv, 记录不存在返回0
   * @param {number} projectId
   * @param {string} countAtTime
   * @param {string} countType
   * @return {number}
   */
  async getTotalUv(projectId, countAtTime, countType) {
    let recordList = await this.uniqueViewRepository
      .createQueryBuilder()
      .where({ projectId, countAtTime, countType })
      .getMany();
    let record = _.get(recordList, [0], {});
    return _.get(record, ['total_count'], 0);
  }

  /**
   * 获取一段时间范围内的uv数
   * @param {*} projectId
   * @param {*} startAt
   * @param {*} finishAt
   * @returns {Number}
   */
  async getUVInRange(projectId, startAt, finishAt) {
    // let startAtMoment = moment
    //   .unix(startAt)
    //   .format(DATE_FORMAT.DATABASE_BY_HOUR);
    // let finishAtMoment = moment
    //   .unix(finishAt)
    //   .format(DATE_FORMAT.DATABASE_BY_HOUR);
    // let tableName = getTableName(projectId, startAt);
    // let rawRecord = await Knex.from(tableName)
    //   .sum('total_count as total')
    //   .where('count_type', '=', DATE_FORMAT.UNIT.HOUR)
    //   .where('count_at_time', '>', startAtMoment)
    //   .andWhere('count_at_time', '<', finishAtMoment)
    //   .catch(e => {
    //     return 0;
    //   });
    // let totalUV = _.get(rawRecord, [0, 'total'], 0);
    // return totalUV;
  }

  async getRawRecordListInRange(projectId, startAt, endAt, countType) {
    let timeList = getDatabaseTimeList(startAt, endAt, countType);
    let rawRecordList = await this.uniqueViewRepository
      .createQueryBuilder('TRUniqueView')
      .where('TRUniqueView.projectId=:projectId', { projectId })
      .andWhere('TRUniqueView.countType=:countType ', { countType })
      .andWhere('TRUniqueView.countAtTime IN (:...timeList)', { timeList })
      .getMany()
      .catch(e => {
        return [];
      });
    return rawRecordList;
  }
}
