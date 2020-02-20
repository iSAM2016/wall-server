/* 项目模块
 * @Author: isam2016
 * @Date: 2020-01-15 16:29:48
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-20 11:46:11
 */
import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { TRCityDistribution } from '@entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
const DateFormat = 'YYYYMM';

@Injectable()
export class CityDistributionService {
  constructor(
    @InjectRepository(TRCityDistribution)
    private readonly cityDistributionRepository: Repository<TRCityDistribution>,
  ) {}
  private readonly logger = new Logger(CityDistributionService.name);

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
