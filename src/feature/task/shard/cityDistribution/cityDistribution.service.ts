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

  /**
   * 根据idList获取原始数据
   * @param {*} projectId
   * @param {*} cityDistributionIdList
   * @param {*} createTimeAt
   */
  async getByIdListInOneMonth(projectId, cityDistributionIdList, createTimeAt) {
    const rawRecordList = await this.cityDistributionRepository
      .createQueryBuilder('TRCityDistribution')
      .where('TRCityDistribution.projectId=:projectId', { projectId })
      .andWhere('TRCityDistribution.id IN (:...cityDistributionIdList)', {
        cityDistributionIdList,
      })
      .andWhere('TRCityDistribution.countAtTime=:countAtTime', {
        countAtTime: createTimeAt,
      })
      .getMany()
      .catch(e => {
        return [];
      });
    return rawRecordList;
  }
  /**
   * 将城市分布数据拍平后, 作为一个列表返回回来, 方便集中处理
   * @param {*} distribution
   * @return {Array}
   */
  getFlattenCityRecordListInDistribution(distribution) {
    let recordList = [];
    for (let country of Object.keys(distribution)) {
      let countryDistribution = distribution[country];
      for (let province of Object.keys(countryDistribution)) {
        let provinceDistribution = countryDistribution[province];
        for (let city of Object.keys(provinceDistribution)) {
          let cityRecord = provinceDistribution[city];
          recordList.push(cityRecord);
        }
      }
    }
    return recordList;
  }
  /**
   * 获取解析后的城市分布记录, 解析失败返回空对象({})
   * @param {number} id
   * @return {object}
   */
  async getCityDistributionRecord(id) {
    let recordList = await this.cityDistributionRepository
      .createQueryBuilder('TRCityDistribution')
      .where('TRCityDistribution.id=:id', { id })
      .getOne()
      .catch(e => {
        return {};
      });
    let resultJson = _.get(recordList, ['cityDistributeJson'], '{}');
    let result = {};
    try {
      result = JSON.parse(resultJson);
      return result;
    } catch (e) {
      return {};
    }
  }

  /**
   * 合并分布数据中, 相同城市的数据, 默认直接相加
   * @param {Object} distributionSource   (来源)从数据库中新查出来的数据
   * @param {Object} distributionDist     (目的地)过往累加计入的结果集
   * @param {Function} processCityData
   */
  mergeDistributionData(
    distributionSource,
    distributionDist,
    processCityData = (cityDataDist, cityDataSource) => {
      return cityDataDist + cityDataSource;
    },
  ) {
    let finalDistribution = _.clone(distributionDist);
    for (let country of Object.keys(distributionSource)) {
      if (_.has(distributionDist, country) === false) {
        // 没有就直接更新上
        _.set(finalDistribution, [country], distributionSource[country]);
        continue;
      }
      let countryDistributionSource = distributionSource[country];
      let countryDistributionDist = distributionDist[country];
      for (let province of Object.keys(countryDistributionSource)) {
        if (_.has(countryDistributionDist, province) === false) {
          _.set(
            finalDistribution,
            [country, province],
            distributionSource[country][province],
          );
          continue;
        }
        let provinceDistributionSource = countryDistributionSource[province];
        let provinceDistributionDist = countryDistributionDist[province];
        for (let city of Object.keys(provinceDistributionSource)) {
          if (_.has(provinceDistributionDist, city) === false) {
            _.set(
              finalDistribution,
              [country, province, city],
              distributionSource[country][province][city],
            );
            continue;
          }
          let cityDistributionSource = provinceDistributionSource[city];
          let cityDistributionDist = provinceDistributionDist[city];
          _.set(
            finalDistribution,
            [country, province, city],
            processCityData(cityDistributionDist, cityDistributionSource),
          );
        }
      }
    }
    return finalDistribution;
  }
}
