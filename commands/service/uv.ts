import * as utility from 'utility';
import { Repository } from 'typeorm';
import { UV } from './entity';
import * as moment from 'moment';
import _ from 'lodash';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '../config/date_format';
import { Inject } from 'typescript-ioc';

function encryptMD5(key: string): string {
  return utility.md5(key);
}

export class UVService {
  @Inject
  private readonly uvRepository: Repository<UV>;
  constructor() {}
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} uuid
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async (projectId, visitAt) => {
    try {
      const userExist = await this.uvRepository.count({ name: 12 });

      // let visitAtHour = moment.unix(visitAt).format(DATABASE_BY_HOUR);
      // let tableName = getTableName(projectId, visitAt);
      // let rawRecordList = await Knex.select('uuid')
      //   .from(tableName)
      //   .where('visit_at_hour', '=', visitAtHour)
      //   .catch(e => {
      //     return [];
      //   });
      // let uuidSet = new Set();
      // for (let rawRecord of rawRecordList) {
      //   let uuid = _.get(rawRecord, ['uuid'], '');
      //   uuidSet.add(uuid);
      // }
      // return uuidSet;
    } catch (error) {
      throw new Error(error);
    }
  };
}
