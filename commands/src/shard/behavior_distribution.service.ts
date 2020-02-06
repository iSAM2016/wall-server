import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@app/config';
import { InjectRepositorys } from '@app/utils';
import { BaseService } from './serviceBase';

const TABLE_NAME = 't_r_behavior_distribution';
const TABLE_COLUMN = [
  `id`,
  `project_id`,
  `code`,
  `name`,
  `url`,
  `total_count`,
  `count_at_time`,
  `count_type`,
  `city_distribute_id`,
  `create_time`,
  `update_time`,
];

function getTableName() {
  return TABLE_NAME;
}

export class BehaviorDistributionService extends BaseService {
  @InjectRepositorys()
  private readonly behaviorDistributionRepository;

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
    let tableName = getTableName();
    let oldRecordList = await this.behaviorDistributionRepository
      .select([`total_count`, `city_distribute_id`, `create_time`, `id`])
      .from(tableName)
      .where('project_id', '=', projectId)
      .andWhere('count_at_time', '=', countAtTime)
      .andWhere('code', '=', code)
      .andWhere('count_type', '=', countType)
      .catch(() => {
        return [];
      });
    return oldRecordList;
  }
  updateBehavior = async (id, data) => {
    let tableName = getTableName();
    let updateResult = await this.behaviorDistributionRepository(tableName)
      .update(data)
      .where(`id`, '=', id);
    return updateResult;
  };

  /**
   * 插入数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表

    let tableName = getTableName();
    // 返回值是一个列表
    let result = await this.behaviorDistributionRepository
      .returning('id')
      .insert(data)
      .into(tableName)
      .catch(err => {
        this.log('插入用户行为数据失败 => 出错' + err.message);
        return [];
      });
    return result;
  }
}
