import * as _ from 'lodash';
import { InjectRepositorys } from 'commands/utils/annotation';
import { BaseService } from './serviceBase';

// uv记录
const BASE_TABLE_NAME = 't_r_unique_view';
const TABLE_COLUMN = [
  `id`,
  `project_id`,
  `total_count`,
  `count_at_time`,
  `count_type`,
  `city_distribute_id`,
  `create_time`,
  `update_time`,
];

/**
 * 获取表名
 * @param {number} projectId 项目id
 * @param {number} createTimeAt 创建时间, 时间戳
 * @return {String}
 */
function getTableName() {
  return BASE_TABLE_NAME;
}

export class UniqueViewService extends BaseService {
  @InjectRepositorys()
  private readonly uniqueViewRepository;

  /**
   * 获取当前项目，当前统计日期下，统计尺度的uv记录总数
   */
  async getRecord(projectId, countAtTime, countType) {
    let tableName = getTableName();
    let recordList = await this.uniqueViewRepository
      .select(TABLE_COLUMN)
      .from(tableName)
      .where('project_id', '=', projectId)
      .andWhere('count_at_time', '=', countAtTime)
      .andWhere('count_type', '=', countType)
      .catch(err => {
        this.log('获取uv记录总数 => 出错' + err.message);
        return [];
      });
    return _.get(recordList, [0], {});
  }

  /**
   * 获取总uv, 记录不存在返回0
   * @param {number} projectId
   * @param {string} countAtTime
   * @param {string} countType
   * @return {number}
   */
  async getTotalUv(projectId, countAtTime, countType) {
    let record = await this.getRecord(projectId, countAtTime, countType);
    return _.get(record, ['total_count'], 0);
  }
}
