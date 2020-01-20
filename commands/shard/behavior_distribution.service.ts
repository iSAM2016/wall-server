import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';

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

export class BehaviorDistributionService {
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
  async replaceRecord(
    projectId,
    code,
    name,
    url,
    totalCount,
    countAtTime,
    countType,
    cityDistribute,
  ) {
    let tableName = getTableName();
    let updateAt = moment().unix();
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
    // 返回值是一个列表
    let result = await (await this.behaviorDistributionRepository).findOne({
      id,
    });

    let updateResult = await (await this.behaviorDistributionRepository)
      .save({ ...result, ...data })
      .catch(e => {
        return [];
      });
    return updateResult;
  };
  /**
   * 插入数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    // 返回值是一个列表
    let result = await (await this.behaviorDistributionRepository)
      .save(data)
      .catch(e => {
        return {};
      });
    return result;
  }
}
