import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseService } from '@app/shard';
import { DATABASE_BY_HOUR } from '@app/config';
import { InjectRepositorys } from '@app/annotation';

const TableNameDateFormat = 'YYYYMM';
const BASE_TABLE_NAME = 't_r_uv_record';
/**
 * 获取表名
 * @param {number} projectId 项目id
 * @param {number} createTimeAt 创建时间, 时间戳
 * @return {String}
 */
function getTableName(projectId, createTimeAt) {
  let dateYm = moment.unix(createTimeAt).format(TableNameDateFormat);
  return `${BASE_TABLE_NAME}_${projectId}_${dateYm}`;
}
export class UVService extends BaseService {
  @InjectRepositorys()
  private readonly uvRepository;
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async (projectId, visitAt) => {
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    let tableName = getTableName(projectId, visitAt);
    let rawRecordList = await this.uvRepository
      .select('uuid')
      .from(tableName)
      .where('visit_at_hour', '=', visitAtHour)
      .catch(err => {
        this.log('获取指定小时内的uuid列表 => 出错' + err.message);
        return [];
      });
    let uuidSet = new Set();
    rawRecordList.forEach(rawRecord => {
      let uuid = _.get(rawRecord, ['uuid'], '');
      uuidSet.add(uuid);
    });
    return uuidSet;
  };
  /**
   * 自动创建&更新uv记录(不更新pv, pv无意义)
   * @param {number} projectId
   * @param {string} uuid
   * @param {number} visitAt
   * @param {string} country
   * @param {string} province
   * @param {string} city
   * @return {boolean}
   */
  replaceUvRecord = async (
    projectId,
    uuid,
    visitAt,
    country,
    province,
    city,
  ) => {
    // pv数无意义, 不再计算 s
    let pvCount = 0;
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    let tableName = getTableName(projectId, visitAt);
    let updateAt = moment().unix();
    // // 返回值是一个列表
    let oldRecordList = await this.uvRepository
      .select([`id`])
      .from(tableName)
      .where('uuid', '=', uuid)
      .andWhere('visit_at_hour', '=', visitAtHour)
      .catch(err => {
        this.log('replaceUvRecord => 出错' + err.message);
        return [];
      });
    // // 利用get方法, 不存在直接返回0, 没毛病
    let id = _.get(oldRecordList, [0, 'id'], 0);
    let data = {
      uuid,
      visit_at_hour: visitAtHour,
      pv_count: pvCount,
      country,
      province,
      city,
      update_time: updateAt,
    };

    let isSuccess = false;
    if (id > 0) {
      let affectRows = await this.uvRepository
        .from(tableName)
        .update(data)
        .where(`id`, '=', id);
      isSuccess = affectRows > 0;
    } else {
      data['create_time'] = updateAt;
      let insertResult = await this.uvRepository
        .returning('id')
        .insert(data)
        .into(tableName)
        .catch(err => {
          this.log('replaceUvRecord => 出错' + err.message);
          return [];
        });
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    return isSuccess;
  };
}
