/* 项目模块
 * @Author: isam2016
 * @Date: 2020-01-15 16:29:48
 * @Last Modified by: isam2016
 * @Last Modified time: 2020-01-16 16:40:06
 */
import * as Knex from 'knex';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import { InjectRepositorys } from 'commands/utils/annotation';
import BaseService from '../serviceBase';
const BASE_TABLE_NAME = 't_o_project';
const TABLE_COLUMN = [
  `id`,
  `project_name`,
  `display_name`,
  `rate`,
  `c_desc`,
  `create_time`,
  `create_ucid`,
  `update_time`,
  `update_ucid`,
  `is_delete`,
];
const DISPLAY_TABLE_COLUMN = [
  `id`,
  `project_name`,
  `display_name`,
  `rate`,
  `c_desc`,
  `create_time`,
  `create_ucid`,
  `update_time`,
  `update_ucid`,
];
function getTableName() {
  return BASE_TABLE_NAME;
}

export class ProjectService extends BaseService {
  @InjectRepositorys()
  private readonly uniqueViewRepository;

  /**
   * 项目列表
   */
  async getList() {
    let tableName = getTableName();
    let result = await this.uniqueViewRepository
      .select(TABLE_COLUMN)
      .from(tableName)
      .where('is_delete', 0)
      .catch(err => {
        this.log(err.message, 'project_item    getlist   出错');
        return [];
      });
    return result;
  }

  // /**
  //  * 获取总uv, 记录不存在返回0
  //  * @param {number} projectId
  //  * @param {string} countAtTime
  //  * @param {string} countType
  //  * @return {number}
  //  */
  // async getTotalUv(projectId, countAtTime, countType) {
  //   let record = await this.getRecord(projectId, countAtTime, countType);
  //   return _.get(record, ['total_count'], 0);
  // }
}
