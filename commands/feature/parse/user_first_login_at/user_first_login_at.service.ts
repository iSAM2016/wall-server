import * as _ from 'lodash';
import * as moment from 'moment';
import { InjectRepositorys } from 'commands/utils/annotation';
import { BaseService } from '@commands/shard';

const BASE_TABLE_NAME = 't_r_user_first_login_at';
const TABLE_COLUMN = [
  `id`,
  `ucid`,
  `first_visit_at`,
  `country`,
  `province`,
  `city`,
  `create_time`,
  `update_time`,
];

/**
 * 获取表名
 * @param {number} projectId 项目id
 * @return {String}
 */
function getTableName(projectId) {
  return `${BASE_TABLE_NAME}_${projectId}`;
}

export class UserFirstLoginAtService extends BaseService {
  @InjectRepositorys()
  private readonly userFirstLoginAtRepository;
  /**
   * 过滤所有已存在在数据库中的ucid(使用Set, 以便区分Map和Object)
   * @param {*} projectId
   * @param {*} allUcidList
   * @returns {object}
   */
  async filterExistUcidSetInDb(projectId, allUcidList) {
    let tableName = getTableName(projectId);
    let rawRecordList = await this.userFirstLoginAtRepository
      .select('ucid')
      .from(tableName)
      .whereIn('ucid', allUcidList);
    let existUcidSet = new Set();
    for (let rawRecord of rawRecordList) {
      let ucid = _.get(rawRecord, ['ucid'], '');
      existUcidSet.add(ucid);
    }
    return existUcidSet;
  }
  /**
   */
  async getOldRecordList(projectId, ucid) {
    let tableName = getTableName(projectId);
    // 返回值是一个列表
    let oldRecordList = await this.userFirstLoginAtRepository
      .select([`id`, `first_visit_at`])
      .from(tableName)
      .where('ucid', '=', ucid)
      .catch(err => {
        this.log('插入插入页面统计数据失败 => 出错' + err.message);
        return [];
      });
    return oldRecordList;
  }
  /**
   *更新
   *
   * @memberof DurationDistributionService
   */
  updateUserFirstLoginAt = async (id, data, projectId) => {
    let tableName = getTableName(projectId);
    let updateResult = await this.userFirstLoginAtRepository(tableName)
      .update(data)
      .where(`id`, '=', id);
    return updateResult;
  };

  /**
   * 插入页面统计
   * @param id
   * @param data
   */
  async insertUserFirstLoginAt(data, projectId) {
    let tableName = getTableName(projectId);
    // 返回值是一个列表
    let result = await this.userFirstLoginAtRepository
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
