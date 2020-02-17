/* 解析UV
 * @Author: isam2016
 * @Date: 2020-01-06 16:06:34
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 18:07:10
 * 独立访问用户数：即UniqueVisitor，访问网站的一台电脑客户端为一个访客。
 * 00:00-24:00内相同的客户端只被计算一次。
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TRUvRecord } from '@entity';
import { Injectable, Logger } from '@nestjs/common';
import {
  DATABASE_BY_MINUTE,
  COMMAND_ARGUMENT_BY_MINUTE,
  DATABASE_BY_HOUR,
} from '@utils';
import { InjectRepository } from '@nestjs/typeorm';
/**
 *  uv 用户点击
 */
@Injectable()
export class UvService extends ParseBase {
  constructor(
    @InjectRepository(TRUvRecord)
    private readonly uvRepository: Repository<TRUvRecord>,
  ) {
    super();
  }

  private readonly logger = new Logger(UvService.name);
  // 统一按项目进行统计
  private projectMap = new Map();
  private endAtMoment;
  private startAtMoment;

  // uv
  // 每10分15秒启动
  @Cron('15 */10 * * * *')
  async handle() {
    let nowByMinute = moment();
    let fifteenMinuteAgoByminute = moment().subtract(15, 'minute');
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
    let uuid = _.get(record, ['uuid'], ''); // 设备唯一标识
    let visitAt = _.get(record, ['time'], 0);
    let projectId = _.get(record, ['project_id'], 0);
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let pvCount = 1;

    if (_.isNumber(visitAt) === false || visitAt === 0 || _.isEmpty({ uuid })) {
      this.logger.log(
        `数据不合法, 自动跳过 visitAt => ${visitAt}, uuid => ${uuid}`,
      );
      return false;
    }
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_MINUTE);
    let uvRecord = {
      projectId,
      visitAt,
      uuid,
      country,
      province,
      city,
      pvCount,
    };
    // 项目=>  时间段(10 分钟) => uid
    // 项目id:{
    //   时间段:{
    //     uid: {}
    //   }
    // }

    let visitAtMap = new Map(); // 时间段区分
    let uvMap = new Map(); // uid 区分
    if (this.projectMap.has(projectId)) {
      // 项目区分
      visitAtMap = this.projectMap.get(projectId);
      if (visitAtMap.has(visitAtHour)) {
        uvMap = visitAtMap.get(visitAtHour);
        if (uvMap.has(uuid)) {
          let oldUvRecord = uvMap.get(uuid);
          uvRecord.pvCount = oldUvRecord.pvCount + uvRecord.pvCount;
        }
      }
    }
    uvMap.set(uuid, uvRecord);
    visitAtMap.set(visitAtHour, uvMap);
    this.projectMap.set(projectId, visitAtMap);

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
    /**
     * 3.将map数据同步到数据库中
     */
    let totalRecordCount = this.getRecordCountInProjectMap(); // 日志总数
    let processRecordCount = 0;
    let successSaveCount = 0; // 成功的条数
    for (let [projectId, visitAtMap] of this.projectMap) {
      for (let [visitAtHour, uvMap] of visitAtMap) {
        let visitAtInDb = moment(visitAtHour, DATABASE_BY_MINUTE).unix();
        let existUuidSet = await this.getExistUuidSetInHour(
          projectId,
          visitAtInDb,
        );
        for (let [uv, uvRecord] of uvMap) {
          let {
            projectId,
            visitAt,
            uuid,
            country,
            province,
            city,
            pvCount,
          } = uvRecord;
          let isSuccess = false;
          uuid = `${uuid}`; // 转成string
          if (existUuidSet.has(uuid) === false) {
            // 只有当uuid不存在时才插入
            isSuccess = await this.replaceUvRecord(
              projectId,
              uuid,
              visitAt,
              country,
              province,
              city,
            );
            // 插入完成后, 把uuid再补进去(意义不大, 只为了增强稳定性)
            existUuidSet.add(uuid);
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
    }
    return { totalRecordCount, processRecordCount, successSaveCount };
  }

  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async (projectId, visitAt) => {
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    let rawRecordList = await this.uvRepository
      .createQueryBuilder()
      .where({ visitAtHour, projectId })
      .getMany();
    let uuidSet = new Set();
    rawRecordList.forEach(rawRecord => {
      let uuid = _.get(rawRecord, ['uuid'], '');
      uuidSet.add(uuid);
    });
    return uuidSet;
  };
  /**
   * 自动创建&更新uv记录(不更新pv, pv无意义)
   * @param {number} projectId
   * @param {string} uuid
   * @param {number} visitAt
   * @param {string} country
   * @param {string} province
   * @param {string} city
   * @return {boolean}
   */
  replaceUvRecord = async (
    projectId,
    uuid,
    visitAt,
    country,
    province,
    city,
  ) => {
    // pv数无意义, 不再计算 s
    let pvCount = 0;
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    let updateAt = moment().unix();

    //返回值是一个列表
    let oldRecordList = await this.uvRepository
      .createQueryBuilder()
      .where({ uuid, visitAtHour, projectId })
      .getMany();
    //利用get方法, 不存在直接返回0, 没毛病
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let data = {
      uuid,
      country,
      province,
      city,
      visitAtHour,
      projectId,
      pvCount,
      updateTime: String(updateAt),
    };

    let isSuccess = false;
    if (id > 0) {
      let result = await this.uvRepository.findOne({ id });
      let affectRows = await this.uvRepository.save({ ...result, ...data });
      isSuccess = true;
    } else {
      data['createTime'] = String(updateAt);
      let insertResult = await this.uvRepository.save(data);
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    return isSuccess;
  };
}
