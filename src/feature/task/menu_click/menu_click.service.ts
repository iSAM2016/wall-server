/* 用户点击情况
 * @Author: isam2016
 * @Date: 2020-01-14 10:30:17
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:12
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { TRBehaviorDistribution, TRCityDistribution } from '@entity';
import {
  UNIT,
  DATABASE_BY_HOUR,
  COMMAND_ARGUMENT_BY_MINUTE,
  getFlattenCityRecordListInDistribution,
} from '@utils';

const DateFormat = 'YYYYMM';

@Injectable()
export class MenuClickService extends ParseBase {
  constructor(
    @InjectRepository(TRBehaviorDistribution)
    private readonly behaviorDistributionRepository: Repository<
      TRBehaviorDistribution
    >,
    @InjectRepository(TRCityDistribution)
    private readonly cityDistributionRepository: Repository<TRCityDistribution>,
  ) {
    super();
  }

  private readonly logger = new Logger(MenuClickService.name);
  // 统一按项目进行统计
  private projectMap = new Map();
  private endAtMoment;
  private startAtMoment;

  @Cron('30 15 * * * *')
  async handle() {
    let nowByMinute = moment();
    let lastDayStartAtByMinute = moment()
      .subtract(1, 'day')
      .startOf('day');
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
   * 统计 projectMenuClickMap 中的记录总数
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
          let oldRecordList = await this.replaceRecord(
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
    let cityDistributeIdInDb = _.get(oldRecordList, [0, 'cityDistributeId'], 0);
    let updateAt = moment().unix();
    let id = _.get(oldRecordList, [0, 'id'], 0);

    let data = {
      projectId,
      countAtTime,
      countType: UNIT.HOUR,
      code,
      name,
      url,
      totalCount,
      update_time: moment().unix(),
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
    let isUpdateSuccess = await this.updateCityDistributionRecord(
      cityDistributeIdInDb,
      JSON.stringify(cityDistribute),
    );
    if (isUpdateSuccess === false) {
      return false;
    }

    let affectRows = await this.updateBehavior(id, data);
    return affectRows > 0;
  }

  async insertData(
    cityDistribute,
    data,
    projectId,
    updateAt,
  ): Promise<boolean> {
    // 首先插入城市分布数据
    let cityDistributeId = await this.insertCityDistributionRecord(
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
   * 自动创建&更新, 并增加total_stay_ms的值
   * @param {number} projectId
   * @param {string} code
   * @param {string} name
   * @param {string} url
   * @param {number} totalCount
   * @param {number} countAtTime
   * @param {string} countType
   * @param {object} cityDistribute
   * @return {boolean}
   */
  async replaceRecord(projectId, code, countAtTime, countType) {
    let oldRecordList = await this.behaviorDistributionRepository
      .createQueryBuilder()
      .where({ projectId, countAtTime, code, countType })
      .getMany();
    return oldRecordList;
  }
  // 更新行为
  updateBehavior = async (id, data) => {
    let result = await this.behaviorDistributionRepository.findOne({
      id,
    });
    let updateResult = await this.behaviorDistributionRepository.save({
      ...result,
      ...data,
    });
    return updateResult;
  };

  /**
   * 插入行为数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表
    return await this.behaviorDistributionRepository.save(data);
  }
  /**
   * 更新城市分布记录, 返回更新是否成功
   * @param {number} id
   * @param {string} cityDistributeJson
   * @return {boolean}
   */
  async updateCityDistributionRecord(id, cityDistributeJson): Promise<boolean> {
    let updateAt = moment().unix();
    let data = {
      cityDistributeJson,
      updateTime: String(updateAt),
    };
    let result = await this.cityDistributionRepository.findOne({ id });
    let affectRows = await this.cityDistributionRepository.save({
      ...result,
      ...data,
    });

    return Number(affectRows.id) > 0;
  }
  /**
   * 插入城市分布记录, 返回插入id
   * @param {string} cityDistributeJson
   * @param {number} projectId
   * @param {number} createTimeAt
   * @return {number}
   */
  async insertCityDistributionRecord(
    cityDistributeJson,
    projectId,
    createTimeAt,
  ) {
    let countAtTime = moment.unix(createTimeAt).format(DateFormat);
    let updateAt = moment().unix();
    let data = {
      cityDistributeJson,
      createTime: String(updateAt),
      updateTime: String(updateAt),
      projectId,
      countAtTime,
    };
    let insertResult = await this.cityDistributionRepository.save(data);
    let insertId = _.get(insertResult, 'id', 0);
    return insertId;
  }
}
