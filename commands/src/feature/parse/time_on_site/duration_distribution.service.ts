import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@app/config';
import { InjectRepositorys } from '@app/utils';
import { BaseService } from '@app/shard';

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
/*
 * 用户停留时长分布， 按天和月进行统计
 * 当前项目 当前统计尺度下 记录用户停留总秒数 同时记录城市分布情况
 *
 */
export class DurationDistributionService extends BaseService {
  @InjectRepositorys()
  private readonly durationDistributionRepository;

  /**
   * 自动创建/替换总uv记录
   */
  replaceUvRecord = async (projectId, countAtTime, countType) => {
    let tableName = getTableName();
    let oldRecordList = await this.durationDistributionRepository
      .select([`city_distribute_id`, `create_time`, `id`])
      .from(tableName)
      .where('project_id', '=', projectId)
      .andWhere('count_at_time', '=', countAtTime)
      .andWhere('count_type', '=', countType)
      .catch(err => {
        this.log('获取uv记录失败 => 出错' + err.message);
        return [];
      });

    return oldRecordList;
  };
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updateDuration = async (id, data) => {
    let tableName = getTableName();
    let updateResult = await this.durationDistributionRepository(tableName)
      .update(data)
      .where(`id`, '=', id);
    return updateResult;
  };

  /**
   * 插入用户停留时间数据
   * @param id
   * @param data
   */
  async insertDuration(data) {
    let tableName = getTableName();
    // 返回值是一个列表
    let result = await this.durationDistributionRepository
      .returning('id')
      .insert(data)
      .into(tableName)
      .catch(err => {
        this.log('插入用户停留时间数据失败 => 出错' + err.message);
        return [];
      });
    return result;
  }
}
