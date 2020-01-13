import * as _ from 'lodash';
import * as moment from 'moment';
import { UniqueView } from '@entity';
import BaseService from '../../serviceBase';
import { DATABASE_BY_HOUR, DATABASE_BY_MINUTE } from '@commands/config';

export class UniqueViewService extends BaseService {
  /**
   * 获取记录
   */
  async getRecord(projectId, countAtTime, countType) {
    // let recordList = await Knex
    const connection = await this.connectMysql();
    let recordList = await connection
      .getRepository(UniqueView)
      .createQueryBuilder()
      .where({ project_id: projectId })
      .andWhere('count_at_time=:countAtTime', countAtTime)
      .andWhere('count_type=:countType', countType)
      .getMany();
    //   .catch(e => {
    //     return []
    //   })
    await connection.close();
    return _.get(recordList, [0], {});
  }

  /**
   * 获取总uv, 记录不存在返回0
   * @param {number} projectId
   * @param {string} countAtTime
   * @param {string} countType
   * @return {number}
   */
  async getTotalUv(projectId, countAtTime, countType) {
    let record = await this.getRecord(projectId, countAtTime, countType);
    return _.get(record, ['total_count'], 0);
  }
}
