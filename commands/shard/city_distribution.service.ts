import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';

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

export class CityDistributionService {
  @InjectRepositorys()
  private readonly cityDistributionRepository;
  /**
   * 插入城市分布记录, 返回插入id
   * @param {string} cityDistributeJson
   * @param {number} projectId
   * @param {number} createTimeAt
   * @return {number}
   */
  async insertCityDistributionRecord(cityDistributeJson) {
    let updateAt = moment().unix();
    let insertResult = await (await this.cityDistributionRepository)
      .save({
        city_distribute_json: cityDistributeJson,
        create_time: updateAt,
        update_time: updateAt,
      })
      .catch(e => {
        // Logger.warn('城市数据插入失败, 错误原因 =>', e); //TODO: logger
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
  async updateCityDistributionRecord(id, cityDistributeJson): Promise<boolean> {
    let updateAt = moment().unix();
    let result = await (await this.cityDistributionRepository).findOne({ id });

    let affectRows = await (await this.cityDistributionRepository)
      .save({
        ...result,
        ...{
          city_distribute_json: cityDistributeJson,
          update_time: updateAt,
        },
      })
      .catch(e => {
        // Logger.warn('城市数据更新失败, 错误原因 =>', e); //TODO://
        return 0;
      });
    return affectRows > 0;
  }
}
