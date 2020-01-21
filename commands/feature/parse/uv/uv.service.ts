import * as _ from 'lodash';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { InjectRepositorys } from 'commands/utils/annotation';
import { DATABASE_BY_HOUR } from '@commands/config';

const TableNameDateFormat = 'YYYYMM';
const VisitAtHourDateFormat = DATABASE_BY_HOUR;
const BASE_TABLE_NAME = 't_o_uv_record';
const TABLE_COLUMN = [
  `id`,
  `uuid`,
  `country`,
  `province`,
  `city`,
  `visit_at_hour`,
  `pv_count`,
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
  let dateYm = moment.unix(createTimeAt).format(TableNameDateFormat);
  return `${BASE_TABLE_NAME}_${projectId}_${dateYm}`;
}
export class UVService {
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} uuid
   * @param {*} visitAt
   * @return {Object}
   */
  @InjectRepositorys()
  private readonly uvRepository;

  getExistUuidSetInHour = async (projectId, visitAt) => {
    // const uvRepository = await this.getRepository(UvRecode);
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    console.log('v');
    let rawRecordList = await this.uvRepository
      .createQueryBuilder()
      .where({
        visit_at_hour: visitAtHour,
      })
      .getMany();
    // //  = await Knex.select('uuid')
    // //   .from(tableName)
    // //   .where('visit_at_hour', '=', visitAtHour)
    // //   .catch(e => {
    // //     return [];
    // //   });
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
    // const uvRepository = await this.getRepository(UvRecode);
    // // 返回值是一个列表
    let oldRecordList = await (await this.uvRepository)
      .select([`id`])
      .from(tableName)
      .where('uuid', '=', uuid)
      .andWhere('visit_at_hour', '=', visitAtHour)
      .catch(() => {
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
      is_delete: 0,
      update_time: updateAt,
    };

    let isSuccess = false;
    if (id > 0) {
      let affectRows = await (await this.uvRepository).findOne({ id });

      await (await this.uvRepository).save(data);
      isSuccess = affectRows ? true : false;
    } else {
      data['create_time'] = updateAt;
      let insertResult = await (await this.uvRepository).save(data).catch(e => {
        return [];
      });
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    // await connection.close();
    return isSuccess;
  };
}
