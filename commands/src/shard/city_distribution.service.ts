import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '../config';
import { InjectRepositorys } from '../utils';
import { BaseService } from './serviceBase';

const DateFormat = 'YYYYMM';

const BaseTableName = 't_r_city_distribution';
const TABLE_COLUMN = [
  `id`,
  `city_distribute_json`,
  `create_time`,
  `update_time`,
];

/**
 * 获取表名
 * @param {number} projectId 项目id
 * @param {number} createTimeAt 创建时间, 时间戳
 * @return {String}
 */
function getTableName(projectId, createTimeAt) {
  let YmDate = moment.unix(createTimeAt).format(DateFormat);
  return BaseTableName + '_' + projectId + '_' + YmDate;
}

export class CityDistributionService extends BaseService {
  @InjectRepositorys()
  private readonly cityDistributionRepository;
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
    let tableName = getTableName(projectId, createTimeAt);
    let updateAt = moment().unix();
    let data = {
      city_distribute_json: cityDistributeJson,
      create_time: updateAt,
      update_time: updateAt,
    };
    let insertResult = await this.cityDistributionRepository
      .returning('id')
      .insert(data)
      .into(tableName)
      .catch(err => {
        this.log('城市数据插入失败 => 出错' + err.message);
        return [];
      });
    let insertId = _.get(insertResult, [0], 0);
    return insertId;
  }
  /**
   * 更新城市分布记录, 返回更新是否成功
   * @param {number} id
   * @param {string} cityDistributeJson
   * @return {boolean}
   */
  async updateCityDistributionRecord(
    id,
    projectId,
    createTimeAt,
    cityDistributeJson,
  ): Promise<boolean> {
    let tableName = getTableName(projectId, createTimeAt);
    let updateAt = moment().unix();
    let data = {
      city_distribute_json: cityDistributeJson,
      update_time: updateAt,
    };
    let affectRows = await this.cityDistributionRepository(tableName)
      .update(data)
      .where('id', '=', id)
      .catch(e => {
        this.log('城市数据更新失败, 错误原因 =>', e.message);
        return 0;
      });
    return affectRows > 0;
  }
}
