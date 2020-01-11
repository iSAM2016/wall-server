import * as _ from 'lodash';
import * as moment from 'moment';
import { UV } from '@entity';
import BaseService from './base';
import { Connection, Repository, createConnection } from 'typeorm';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';
interface ConnectionInterface<T> {
  connection: Connection;
  repository: Repository<T>;
}

export class UVService extends BaseService {
  async getRepository(): Promise<ConnectionInterface<UV>> {
    let connection: Connection = await this.getConnection();
    return { connection, repository: connection.getRepository(UV) };
  }
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} uuid
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async (projectId, visitAt) => {
    const { connection, repository } = await this.getRepository();
    let UVRepository = connection.getRepository(UV);

    let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
    console.log(visitAtHour);
    let rawRecordList = await UVRepository.createQueryBuilder()
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
    await connection.close();
    console.log(999);
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
    // let tableName = getTableName(projectId, visitAt);
    let updateAt = moment().unix();
    const { connection, repository } = await this.getRepository();

    // // 返回值是一个列表
    let oldRecordList = await repository
      .createQueryBuilder('uv')
      .where({ uuid })
      .andWhere('uv.visit_at_hour = :visitAtHour', { visitAtHour })
      .getMany();
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

    console.log(data);
    console.log(id);
    let isSuccess = false;
    if (id > 0) {
      let affectRows = await repository.findOne({ id });

      await repository.save(data);
      isSuccess = affectRows ? true : false;
    } else {
      data['create_time'] = updateAt;
      let insertResult = await repository.save(data).catch(e => {
        return [];
      });
      let insertId = _.get(insertResult, [0], 0);
      isSuccess = insertId > 0;
    }
    await connection.close();
    return isSuccess;
  };
}
