import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';

const TableName = 't_r_duration_distribution';
const TABLE_COLUMN = [
  `id`,
  `project_id`,
  `total_stay_ms`,
  `total_uv`,
  `count_at_time`,
  `count_type`,
  `city_distribute_id`,
  `create_time`,
  `update_time`,
];
function getTableName() {
  return TableName;
}

export class DurationDistributionService {
  @InjectRepositorys()
  private readonly durationDistributionRepository;

  /**
   * 自动创建/替换总uv记录
   */
  replaceUvRecord = async (projectId, countAtTime, countType) => {
    let tableName = getTableName();
    // 返回值是一个列表
    let oldRecordList = await this.durationDistributionRepository
      .select([`city_distribute_id`, `create_time`, `id`])
      .from(tableName)
      .where('project_id', '=', projectId)
      .andWhere('count_at_time', '=', countAtTime)
      .andWhere('count_type', '=', countType)
      .catch(() => {
        return [];
      });
    // let oldRecordList = await Knex.select([//TODO:
    //   `city_distribute_id`,
    //   `create_time`,
    //   `id`,
    // ])
    return oldRecordList;
  };
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updateDuration = async (id, data) => {
    // 返回值是一个列表
    let result = await (await this.durationDistributionRepository).findOne({
      id,
    });

    let updateResult = await (await this.durationDistributionRepository)
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
    let result = await (await this.durationDistributionRepository)
      .save(data)
      .catch(e => {
        return {};
      });
    return result;
  }
}
