import * as moment from 'moment';
import * as _ from 'lodash';
import { UV } from '@entity';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
import BaseService from './base';
import { Connection } from 'typeorm';
interface connectionInterface {
  connection: Connection;
  Repository<UV>
}

export class UVService extends BaseService {
  async getRepository() {
    let connection:Connection = await this.getConnection();
    return [connection, connection.getRepository(UV)];
  }
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} uuid
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async (projectId, visitAt) => {
    let [connection, UVRepository] = await this.getRepository();
    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    console.log(visitAtHour);
    let rawRecordList = await UVRepository.createQueryBuilder()
      .where({
        visit_at_hour: visitAtHour,
      })
      .getManyAndCount();
    // //  = await Knex.select('uuid')
    // //   .from(tableName)
    // //   .where('visit_at_hour', '=', visitAtHour)
    // //   .catch(e => {
    // //     return [];
    // //   });
    let uuidSet = new Set();
    rawRecordList[0].forEach(rawRecord => {
      let uuid = _.get(rawRecord, ['uuid'], '');
      uuidSet.add(uuid);
    });
    connection.close();
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
    // pv数无意义, 不再计算
    let pvCount = 0;

    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    // let tableName = getTableName(projectId, visitAt);
    let updateAt = moment().unix();
    let connection = await this.getConnection();
    let UVRepository = connection.getRepository(UV);
    // 返回值是一个列表
    let oldRecordList = await UVRepository.createQueryBuilder('uv')
      .where('uv.uuid=', uuid)
      .andWhere('uv.visit_at_hour = :visitAtHour ', { visitAtHour })
      .getMany();
    // 利用get方法, 不存在直接返回0, 没毛病
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
      let affectRows = await Knex(tableName)
        .update(data)
        .where(`id`, '=', id);
      isSuccess = affectRows > 0;
    } else {
      data['create_time'] = updateAt;
      let insertResult = await Knex.returning('id')
        .insert(data)
        .into(tableName)
        .catch(e => {
          return [];
        });
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    return isSuccess;
  };
}
