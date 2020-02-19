/* 解析分布设备
 * @Author: isam2016
 * @Date: 2020-01-14 10:30:17
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 09:09:05
 */

import * as _ from 'lodash';
import * as moment from 'moment';
import ParseBase from '../paseBase';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { TRSystemCollection } from '@entity';
import { Injectable, Logger } from '@nestjs/common';
import { DATABASE_BY_MONTH, COMMAND_ARGUMENT_BY_MINUTE } from '@utils';
import { InjectRepository } from '@nestjs/typeorm';
/**
 *  设备分布记录表
 */
@Injectable()
export class DeviceService extends ParseBase {
  constructor(
    @InjectRepository(TRSystemCollection)
    private readonly deviceRepository: Repository<TRSystemCollection>,
  ) {
    super();
  }

  private readonly logger = new Logger(DeviceService.name);
  // 统一按项目进行统计
  private projectMap = new Map();
  private endAtMoment;
  private startAtMoment;

  // 每15分0秒启动
  @Cron('0 */15 * * * *')
  // @Cron('0 */3  * * * *')
  async handle() {
    let nowByMinute = moment();
    let lastDayStartAtByMinute = moment()
      .subtract(15, 'minute')
      .startOf('minute');

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
    let commonInfo = _.get(record, ['common'], {});
    let ua = _.get(record, ['ua'], {});
    let uuid = _.get(commonInfo, ['uuid'], '');
    let visitAt = _.get(record, ['time'], 0);
    let projectId = _.get(record, ['project_id'], 0);
    let country = _.get(record, ['country'], '');
    let province = _.get(record, ['province'], '');
    let city = _.get(record, ['city'], '');
    let browser = _.get(ua, ['browser', 'name'], '');
    let browserVersion = _.get(ua, ['browser', 'version'], '');
    let engine = _.get(ua, ['engine', 'name'], '');
    let engineVersion = _.get(ua, ['engine', 'version'], '');
    let deviceVendor = _.get(ua, ['device', 'vendor'], '');
    let deviceModel = _.get(ua, ['device', 'model'], '');
    let os = _.get(ua, ['os', 'name'], '');
    let osVersion = _.get(ua, ['os', 'version'], '');
    let runtimeVersion = _.get(commonInfo, ['runtime_version'], '');
    let visitAtMonth = moment.unix(visitAt).format(DATABASE_BY_MONTH);
    let deviceRecord = {
      projectId,
      visitAt,
      uuid, // 设备名
      browser,
      browserVersion,
      engine,
      engineVersion,
      deviceVendor,
      deviceModel,
      os,
      osVersion,
      country,
      province,
      city,
      runtimeVersion,
    };
    // 数据清洗迭代器//TODO:
    // if (!this.dataCleaning.getData(deviceRecord)) {
    //   return false;
    // }

    let visitAtMap = new Map();
    let deviceMap = new Map();
    // 项目=> 时间段 =>  uuid
    // 判断是否存在该项目
    if (this.projectMap.has(projectId)) {
      visitAtMap = this.projectMap.get(projectId);
      if (visitAtMap.has(visitAtMonth)) {
        // 判断是否有该时间段
        deviceMap = visitAtMap.get(visitAtMonth);
      }
    }
    deviceMap.set(uuid, deviceRecord);
    visitAtMap.set(visitAtMonth, deviceMap);
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
   * 统计 projectDeviceMap 中的记录总数
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
    let totalRecordCount = this.getRecordCountInProjectMap();
    let processRecordCount = 0;
    let successSaveCount = 0;
    for (let [projectId, visitAtMap] of this.projectMap) {
      for (let [visitAtMonth, deviceMap] of visitAtMap) {
        for (let [uuid, deviceRecord] of deviceMap) {
          let { visitAt } = deviceRecord;
          const sqlParams = {
            uuid,
            browser: deviceRecord.browser,
            browserVersion: deviceRecord.browserVersion,
            engine: deviceRecord.engine,
            engineVersion: deviceRecord.engineVersion,
            deviceVendor: deviceRecord.deviceVendor,
            deviceModel: deviceRecord.deviceModel,
            os: deviceRecord.os,
            osVersion: deviceRecord.osVersion,
            country: deviceRecord.country,
            province: deviceRecord.province,
            city: deviceRecord.city,
            runtimeVersion: deviceRecord.runtimeVersion,
            visitAtMonth,
            projectId,
            logAt: visitAt,
          };
          let oldListRest = await this.getOldList(
            projectId,
            visitAtMonth,
            uuid,
          );
          let id = _.get(oldListRest, [0, 'id'], 0);
          let updateAt = moment().unix();
          let isSuccess = false;
          if (id > 0) {
            sqlParams['updateTime'] = String(updateAt);
            let affectRows = await this.updataDevice(sqlParams, id);
            isSuccess = affectRows > 0;
          } else {
            sqlParams['createTime'] = String(updateAt);
            sqlParams['updateTime'] = String(updateAt);
            const insertId = await this.createDevice(sqlParams);
            isSuccess = insertId > 0;
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
   * 查询设备记录
   * @param projectId
   * @param visitAtMonth
   * @param uuid 设备号
   */
  async getOldList(projectId, visitAtMonth, uuid) {
    let oldListResult = await this.deviceRepository
      .createQueryBuilder()
      .where({ visitAtMonth, uuid, projectId })
      .getMany();
    return oldListResult;
  }
  /**
   * 更新数据
   * @param datas
   * @param projectId
   * @param visitAtMonth
   */
  async updataDevice(datas, id) {
    let result = await this.deviceRepository.createQueryBuilder().where({ id });
    let affectRows = await this.deviceRepository.save({
      ...result,
      ...datas,
    });
    return affectRows;
  }
  /**
   * 创建设备数据
   * @param datas
   * @param projectId
   */
  async createDevice(datas) {
    let createResultId = await this.deviceRepository.save(datas);
    return createResultId;
  }
}
