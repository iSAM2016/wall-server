import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_UNIT, UNIT } from '@app/config';
import { InjectRepositorys } from '@app/utils';
import { BaseService } from '@app/shard';

const BASE_TABLE_NAME = 't_r_performance';
const TABLE_COLUMN = [
  `id`,
  `sum_indicator_value`,
  `pv`,
  `indicator`,
  `url`,
  `city_distribute_id`,
  `count_at_time`,
  `count_type`,
  `create_time`,
  `update_time`,
];

/**
 * 获取表名
 * @param {*} projectId
 * @param {number} createAt
 */
function getTableName(projectId, createAt) {
  let createAtMoment = moment.unix(createAt);
  let monthStr = createAtMoment.clone().format('YYYYMM');
  return `${BASE_TABLE_NAME}_${projectId}_${monthStr}`;
}
/*
 * 用户停留时长分布， 按天和月进行统计
 * 当前项目 当前统计尺度下 记录用户停留总秒数 同时记录城市分布情况
 *
 */
export class PerformanceService extends BaseService {
  @InjectRepositorys()
  private readonly performanceRepository;

  /**
   * 自动创建&更新页面性能数据记录
   */
  async getRecordList(
    projectId,
    url,
    indicator,
    countAt,
    countType = UNIT.MINUTE,
  ) {
    let tableName = getTableName(projectId, countAt);
    let dateFormat = DATABASE_BY_UNIT[countType];
    let countAtTime = moment.unix(countAt).format(dateFormat);
    // 返回值是一个列表
    let oldRecordList = await this.performanceRepository
      .select([`id`, `create_time`, `city_distribute_id`])
      .from(tableName)
      .where({
        url: url,
        indicator: indicator,
        count_at_time: countAtTime,
        count_type: countType,
      })
      .catch(err => {
        this.log(' 页面性能查询失败, 错误原因 => 出错' + err.message);
        return [];
      });
    return oldRecordList;
  }
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updatePerformance = async (id, data, projectId, countAt) => {
    let tableName = getTableName(projectId, countAt);
    let updateResult = await this.performanceRepository(tableName)
      .update(data)
      .where(`id`, '=', id);
    return updateResult;
  };

  /**
   * 插入页面统计
   * @param id
   * @param data
   */
  async insertPerformance(data, projectId, countAt) {
    let tableName = getTableName(projectId, countAt);
    // 返回值是一个列表
    let result = await this.performanceRepository
      .returning('id')
      .insert(data)
      .into(tableName)
      .catch(err => {
        this.log('插入插入页面统计数据失败 => 出错' + err.message);
        return [];
      });
    return result;
  }
}
