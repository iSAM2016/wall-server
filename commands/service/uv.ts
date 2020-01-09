import * as utility from 'utility';
import { Repository, createConnection } from 'typeorm';
// import { UV } from '@entity';
import * as moment from 'moment';
import _ from 'lodash';
import { User } from './entity/User.entity';
import { getConnection } from '@commands/feature';
function encryptMD5(key: string): string {
  return utility.md5(key);
}

export class UVService {
  constructor() {}
  /**
   * 获取指定小时内的uuid列表
   * @param {*} projectId
   * @param {*} uuid
   * @param {*} visitAt
   * @return {Object}
   */
  getExistUuidSetInHour = async () => {
    try {
      let connection = await getConnection();
      let UVRepository = connection.getRepository(User);
      UVRepository.find({ id: 1 })
        .then(post => console.log('Post has been saved: ', post))
        .then(() => {
          connection.close();
        })
        .catch(error => console.log('Cannot save. Error: ', error));

      // const userExist = await this.uvRepository.count({ uuid: '12' });
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
      return true;
    } catch (error) {
      console.log('oooo');
      throw new Error(error);
    }
  };
}
